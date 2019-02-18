const { decode } = require('he');

const extractor = (e, selector, f = f => f) => f(decode(e.querySelector(selector).rawText.trim()));

module.exports = {
  name: 'Qlik Restaurant',
  url: 'https://smartakok.se/vara-kok/qlik/',
  parse: async (root) => root.querySelectorAll('tbody').map((day, i) => day.querySelectorAll('.menu__day__type').map(d => ({
    type: extractor(d, '.menu__day__type__title'),
    dish: extractor(d, '.menu__day__type__dish'),
    price: extractor(d, '.menu__day__type__price', d => parseFloat(d) || null),
  }))),
};
