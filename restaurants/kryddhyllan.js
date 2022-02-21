const { decode } = require('he');

const extractor = (e, selector, f = f => f) => f(decode(e.querySelector(selector).rawText.trim()));

module.exports = {
  name: 'Kryddhyllan',
  url: 'https://www.kryddhyllanilund.se/',
  parse: async (root) => {
    const entries = [[], [], [], [], []];
    let currentDay = 0;
    root.querySelectorAll('.menu_multiple_wrapper .one').forEach((entry, i) => {
      const isFirstOption = i % 3 === 0;
      if (isFirstOption) currentDay = i / 3;
      //console.log(isFirstOption, currentDay);
      if (entries[currentDay]) {
        const title = entry.querySelector('.menu_title').rawText.trim();
        const excerpt = (entry.querySelector('.menu_excerpt') || { rawText: ''}).rawText.trim();
        entries[currentDay].push({
          type: 'Dagens',
          dish: `${title}${excerpt && ` ${excerpt}` || ''}`,
          price: parseFloat(entry.querySelector('.menu_price').rawText),
        });
      }
    });
    return entries;
  },
};
