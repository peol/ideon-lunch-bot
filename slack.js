const { RTMClient, WebClient } = require('@slack/client');

const { menus, format } = require('./lunches');

const reactions = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on('message', async (message) => {
  if (message.text !== '!lunch') return;

  const lunches = await menus();
  const msg = await web.chat.postMessage({ channel: message.channel, text: format(lunches, reactions) });
  let idx = 0;
  for (const item in lunches) {
    await web.reactions.add({ channel: message.channel, timestamp: msg.ts, name: reactions[idx] });
    idx += 1;
  }

  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});
