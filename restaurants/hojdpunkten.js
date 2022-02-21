const { decode } = require('he');

module.exports = {
  name: 'Smaka på Kina (f.k.a. Höjdpunkten)',
  url: 'https://www.smakapakina.se/meny',
  parse: async (root) => {
    const entries = [[],[],[],[],[]];
    let currentDay = 0;
    const dagens = root.querySelector('.smallholder');
    if (!dagens) return [];
    dagens.querySelectorAll('p').filter(e => e.rawText.match(/^(1|2)/)).forEach((entry, i) => {
      const isFirstOption = i % 2 === 0;
      if (isFirstOption) currentDay = i / 2;
      entries[currentDay].push({
        type: 'Dagens',
        dish: decode(entry.rawText.replace(/^(1|2)(\.)?/, '').trim()),
        price: 75,
      });
    });
    return entries;
  },
};
