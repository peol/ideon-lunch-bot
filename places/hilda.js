const { decode } = require('he');

const trim = e => e ? e.rawText.trim() : '';

module.exports = {
  name: 'Restaurang Hilda',
  url: 'https://eurest.mashie.com/public/menu/restaurang+hilda/8b31f89a?country=se',
  raw: true,
  parse: async (raw) => {
    const json = raw.split('weekData = ')[1].split('</scr')[0].replace(/new Date.+?\)/g, 'null');
    const parsed = JSON.parse(json);
    return parsed.Weeks[0].Days.map(d => (d.DayMenus.map(m => ({
      type: m.MenuAlternativeName,
      dish: m.DayMenuName,
      price: null,
    }))));
  },
};
