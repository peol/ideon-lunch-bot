const { parse: parseHTML } = require('node-html-parser');
const { readFileSync } = require('fs');
const request = require('request-promise-native');

const places = [
    'qlik', 'edison', 'bricks',
    'hojdpunkten', 'hilda', 'bryggan',
    'kryddhyllan',
];

const getMenusForDay = (menus, date) => {
  return menus.map(p => ({ ...p, menu: p.menu[date.getUTCDay() - 1] }));
};

const formatOne = (item, reaction) => `
:${reaction}: *${item.name}* — ${item.url}
${item.menu.map(e => `*${e.type}:* ${e.dish} (${e.price || '??'}:-)`).join('\n')}
`;

const format = (menus, reactions) => menus.map((m, i) => formatOne(m, reactions[i])).join('\n\n');

module.exports = {
  menus: async (when) => {
    const menus = [];
    for (const place of places) {
        const { name, url, parse, raw } = require(`./places/${place}`);
        try {
            console.log('fetching', name);
            let data = await request({ uri: url, timeout: 5000 });
            //let data = readFileSync(`test/${place}.html`, 'utf-8');
            if (!raw) data = parseHTML(data);
            const menu = await parse(data);
            menus.push({ name, url, menu });
        } catch(e) {
            console.log('failed to fetch', name);
        }
    }
    const filtered = getMenusForDay(menus, when);
    return filtered;
  },
  format,
  formatOne,
};

if (process.argv.indexOf('debug') > -1) {
  (async () => {
    const reactions = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const menus = await module.exports.menus(new Date());
    //console.log(formatOne(menus[0], reactions[0]));
    console.log(format(menus, reactions));
  })();
}
