const { RTMClient, WebClient } = require('@slack/client');

const { menus, format } = require('./lunches');

const DAY = 24 * 60 * 60 * 1000;
const reactions = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on('message', async (message) => {
  const parts = message.text.split(' ');
  if (parts[0] !== '!lunch') return;
  let when = new Date();
  if (parts[1] === 'yesterday') when = new Date(Date.now() - DAY);
  if (parts[1] === 'tomorrow') when = new Date(Date.now() + DAY);

  if (when.getDay() === 0 || when.getDay() === 6) {
    return await web.chat.postMessage({ channel: message.channel, text: 'No lunch on weekends :(' });
  }

  const lunches = await menus(when);
  const msg = await web.chat.postMessage({ channel: message.channel, text: `
    Lunch alternatives for ${when.toISOString().split('T')[0]} — \`!lunch today/tomorrow/yesterday\`

    ${format(lunches, reactions) }
` });
  let idx = 0;
  for (const item in lunches) {
    await web.reactions.add({ channel: message.channel, timestamp: msg.ts, name: reactions[idx] });
    idx += 1;
  }

  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});
