const { decode } = require('he');

const trim = e => e ? e.rawText.trim() : '';

module.exports = {
  name: 'Bricks Eatery',
  url: 'https://brickseatery.se/lunch/',
  parse: async (root) => {
    const entries = root.querySelectorAll('.lunch table').map((day, i) => {
      return day.querySelectorAll('tr').map(row => {
        const cols = row.querySelectorAll('td');
        return {
          type: trim(cols[0]),
          dish: decode(trim(cols[1])),
          price: parseFloat(cols[2].rawText),
        };
      });
    });
    return entries;
  }
};
