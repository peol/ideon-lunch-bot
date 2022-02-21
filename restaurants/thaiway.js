module.exports = {
  name: 'Thaiway (food truck)',
  url: 'http://www.thaiway.se',
  parse: async (root) => {
    const dishes = root.querySelectorAll('#page-zones__main-widgets__content1 p').map(p => {
      return {
        type: p.querySelector('strong:first-child').text.replace(/\*/g, ''),
        dish: p.querySelector('br').nextSibling.text,
        price: 79,
      };
    });
    return [dishes, dishes, dishes, dishes, dishes];
  },
};
