const { parse: parseHTML } = require('node-html-parser');
//const { readFileSync } = require('fs');
const request = require('request-promise-native');

const places = [
    'qlik', 'edison', 'bricks',
    'hojdpunkten', 'hilda', 'bryggan',
    'kryddhyllan',
];

const getMenusForDay = (menus, date) => menus.map(p => ({ ...p, menu: p.menu[date.getDay() - 1] }));

module.exports = {
  menus: async (when) => {
    const menus = [];
    for (const place of places) {
        const { name, url, parse, raw } = require(`./places/${place}`);
        let data = await request(url);
        //let data = readFileSync(`test/${place}.html`, 'utf-8');
        if (!raw) data = parseHTML(data);
        const menu = await parse(data);
        menus.push({ name, url, menu });
    }
    const today = getMenusForDay(menus, when);
    return today;
  },
  format: (menus, reactions) => menus.map((m, i) => `
:${reactions[i]}: *${m.name}* — ${m.url}
${m.menu.map(e => `*${e.type}:* ${e.dish} (${e.price || '??'}:-)
`).join('\n')}`).join('\n\n')
};

