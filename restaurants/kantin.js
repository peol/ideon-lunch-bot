module.exports = {
  name: 'Kantin',
  url: 'https://www.kantinlund.se/',
  parse: async (root) => {
    const entries = [];
    const nodes = root.querySelectorAll('[style="margin-top: 0px;margin-bottom: 0px;"] strong');
    const veg = nodes[5].nextSibling.text;
    const price = parseFloat(nodes[6].text.split(' ')[1]);
    nodes.slice(0, 4).forEach(n => {
      entries.push([{
        type: 'Dagens',
        dish: n.nextSibling.text,
        price: price,
      }, {
        type: 'Vegetarian',
        dish: veg,
        price: price,
      }]);
    });
    return entries;
  },
};
