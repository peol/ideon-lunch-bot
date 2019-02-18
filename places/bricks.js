const { decode } = require('he');

const trim = e => e ? e.rawText.trim() : '';

module.exports = {
  name: 'Bricks Eatery',
  url: 'https://brickseatery.se/lunch/',
  parse: async (root) => {
    const entries = [];
    root.querySelectorAll('.lunch table').forEach((day, i) => {
      const cols = day.querySelectorAll('td');
      entries.push([{
        type: trim(cols[0]),
        dish: decode(trim(cols[1])),
        price: parseFloat(cols[2].rawText),
      }, {
        type: trim(cols[3]),
        dish: decode(trim(cols[4])),
        price: parseFloat(cols[5].rawText),
      }]);
    });
    return entries;
  },
};
