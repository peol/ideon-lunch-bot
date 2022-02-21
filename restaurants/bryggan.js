const { decode } = require('he');

const days = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];

module.exports = {
  name: 'Bryggan Café (IKDC)',
  url: 'http://www.bryggancafe.se/veckans-lunch/',
  parse: async (root) => {
    const entries = [[],[],[],[],[]];
    // their page is just so broken, have a go at it if you want
    return entries;
  },
};
