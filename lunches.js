const { parse: parseHTML } = require('node-html-parser');
const { mkdirSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const { dirname } = require('path');
const request = require('request-promise-native');

const RESTAURANTS_PATH = `${__dirname}/restaurants`;
const CACHE_PATH = `${__dirname}/cache`;
const RESTAURANTS = ['qlik', 'edison', 'bricks', 'paolos',/*'hojdpunkten',*/ 'kryddhyllan'];
// build list of restaurants from disk:
// const RESTAURANTS = readdirSync(RESTAURANTS_PATH).map(f => f.split('.')[0]).filter(f => f.indexOf('_disabled') === -1);

// helper to create folders without throwing errors:
const createFolder = (path) => { try { mkdirSync(path); } catch(e) {} };

// helper to read a restaurant cache from disk:
const readRestaurantCache = (path) => {
  createFolder(dirname(path));
  let content = null;
  try { content = readFileSync(path, 'utf-8'); } catch(e) {}
  return content;
} 

// helper to write restaurant cache to disk:
const writeRestaurantCache = (path, content) => writeFileSync(path, content);

// formats a list of restaurants into markdown syntax:
const format = (menus, dayIdx, reactions) => menus.map((m, i) => formatOne(m, dayIdx, reactions[i])).join('\n');

// formats one restaurant into markdown syntax:
const formatOne = (menu, dayIdx, reaction) => `
:${reaction}: *${menu.name}* — ${menu.url}
${menu.dishes[dayIdx].map(e => `*${e.type}:* ${e.dish} (${e.price || '??'}:-)`).join('\n')}
`;

// create the cache folder, silently fail if it exists (or if it cannot be created...):
createFolder(CACHE_PATH);

// get a parsed menu for a restaurant:
const getMenu = async (place) => {
  const { name, url, parse, raw } = require(`${RESTAURANTS_PATH}/${place}`);
  const cacheFile = `${CACHE_PATH}/${new Date().toISOString().split('T')[0]}/${place}.html`;
  let data = readRestaurantCache(cacheFile);
  if (!data) {
    try {
      console.log('fetching fresh:', name);
      data = await request({ uri: url, timeout: 5000 });
      //data = readFileSync(`${__dirname}/test/${place}.html`, 'utf-8');
      writeRestaurantCache(cacheFile, data);
    } catch(e) {
      console.log('failed to fetch:', name);
    }
  } else {
    console.log('found cached:', name);
  }
  if (!data) return null;
  console.log('parsing:', name);
  if (!raw) data = parseHTML(data);
  return { name, url, dishes: await parse(data) };
};

// returns a list of restaurants and their week menus, filtering out any
// restaurants which couldn't be found/fetched:
const getMenus = async () => {
  // fetch all restaurant menus in parallel:
  const menus = await Promise.all(RESTAURANTS.map(getMenu));
  // only return menus that could be parsed:
  return menus.filter(p => p);
};

module.exports = {
  getMenus,
  format,
  formatOne,
};

if (process.argv.indexOf('debug') > -1) {
  (async () => {
    const menus = await getMenus();
    const day = new Date().getUTCDay() - 1;
    //console.log(formatOne(menus[0], new Date().getUTCDay() - 1, 'reaction'));
    //console.log(format(menus, 1, []));
    console.log(format(menus, day, []));
  })();
}
