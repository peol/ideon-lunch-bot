const { RTMClient, WebClient } = require('@slack/client');

const { menus, format, formatOne } = require('./lunches');

const DAY = 24 * 60 * 60 * 1000;
const reactions = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start();

rtm.on('message', async (message) => {
  if (!message.text) return;
  const parts = message.text.split(' ');
  if (parts[0] !== '!lunch') return;
  let when = new Date();
  if (parts[1] === 'yesterday') when = new Date(Date.now() - DAY);
  if (parts[1] === 'tomorrow') when = new Date(Date.now() + DAY);

  if (when.getDay() === 0 || when.getDay() === 6) {
    return await web.chat.postMessage({ channel: message.channel, text: 'No lunch on weekends :(' });
  }

  const lunches = await menus(when);
  const parentMsg = await web.chat.postMessage({ channel: message.channel, text: `
Lunch alternatives for ${when.toISOString().split('T')[0]} — \`!lunch today/tomorrow/yesterday\`. See thread for menu alternatives.
` });
  let idx = 0;
  const text = format(lunches, reactions);
  await web.chat.postMessage({ channel: message.channel, thread_ts: parentMsg.message.ts, text });
  for (const item of lunches) {
    //const text = formatOne(item, reactions[idx]);
    //await web.chat.postMessage({ channel: message.channel, thread_ts: parentMsg.message.ts, text });
    await web.reactions.add({ channel: message.channel, timestamp: parentMsg.message.ts, name: reactions[idx] });
    await new Promise(resolve => setTimeout(resolve, 2000));
    idx += 1;
  }

  console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
});
