const { decode } = require('he');

const days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];

module.exports = {
  name: 'Bryggan Café (IKDC)',
  url: 'http://www.bryggancafe.se/veckans-lunch/',
  parse: async (root) => {
    const entries = [[],[],[],[],[]];
    let currentDay = null;
    root.querySelectorAll('.et_pb_promo_description p').forEach((paragraph) => {
      const day = paragraph.rawText.match(/(måndag|tisdag|onsdag|torsdag|fredag)/i);
      if (day) return currentDay = days.indexOf(day[1]);

      const dagens = paragraph.rawText.match(/dagens: (.+)/i);
      if (dagens) return entries[currentDay].push({
        type: 'Dagens',
        dish: decode(dagens[1]).trim(),
        price: 89,
      });

      const veg = paragraph.rawText.match(/veg: (.+)/i);
      if (veg) return entries[currentDay].push({
        type: 'Vegetarisk',
        dish: decode(veg[1]).trim(),
        price: 89,
      });
    });

    return entries;
  },
};
