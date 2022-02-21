const { decode } = require('he');

const trim = e => e ? e.text.trim() : '';
const traverseSiblings = (elem, steps) => {
  let target = elem;
  let i = 0;
  while (i < steps) {
    target = target.nextElementSibling;
    i += 1;
  }
  return target;
};

module.exports = {
  name: 'Paolo\'s Italian',
  url: 'https://www.paolositalian.se/menyer/lund/',
  parse: async (root) => {
    const entries = [];
    const price = parseFloat(root.querySelector('.menu-block__h4-menu-header .menu-block__price').rawText);
    const dailies = root.querySelector('.menu-block__desc');
    const startNodes = ['MÅNDAG', 'TISDAG', 'ONSDAG', 'TORSDAG', 'FREDAG'];
    dailies.querySelectorAll('p').forEach((p) => {
      const cleanText = p.text.replace(':', '').trim();
      if (startNodes.indexOf(cleanText) > -1) {
        const daily = [];
        for (let i = 0; i < 3; i += 1) {
          daily.push({
            type: 'Pizza',
            dish: traverseSiblings(p, 2 + i).text,
            price,
          });
        }
        for (let i = 0; i < 2; i += 1) {
          daily.push({
            type: 'Pasta',
            dish: traverseSiblings(p, 6 + i).text,
            price,
          });
        }
        entries.push(daily);
        // each day has 3 pizzas and 2 pastas
      }
    });
    return entries;
  },
};
