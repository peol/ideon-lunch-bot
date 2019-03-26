const { WebClient } = require('@slack/client');

const { getMenus, format, formatOne } = require('./lunches');

const DAY = 24 * 60 * 60 * 1000;
const REACTION_DELAY = 1100;
const REACTIONS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// this will be the new one instead of RTM at some point:
const respond = async (req, res) => {
  res.status(200).send();
  const message = req.body;

  console.log(message);

  let when = new Date();

  if (message.text === 'yesterday') when = new Date(Date.now() - DAY);
  if (message.text === 'tomorrow') when = new Date(Date.now() + DAY);

  if (when.getDay() === 0 || when.getDay() === 6) {
    return await web.chat.postEphemeral({
      channel: message.channel_id,
      user: message.user_id,
      text: 'No lunch on weekends :(',
    });
  }

  const lunches = await getMenus(when);
  const parentMsg = await web.chat.postMessage({
    channel: message.channel_id,
    text: `Lunches for ${when.toISOString().split('T')[0]}. See thread! Requested by <@${message.user_id}>.`,
  });
  let idx = 0;
  const text = format(lunches, when.getDay() - 1, REACTIONS);
  await web.chat.postMessage({ channel: message.channel_id, thread_ts: parentMsg.message.ts, text });
  for (const item of lunches) {
    //const text = formatOne(item, reactions[idx]);
    //await web.chat.postMessage({ channel: message.channel, thread_ts: parentMsg.message.ts, text });
    await web.reactions.add({ channel: message.channel_id, timestamp: parentMsg.message.ts, name: REACTIONS[idx] });
    await new Promise(resolve => setTimeout(resolve, REACTION_DELAY));
    idx += 1;
  }
};

module.exports = { respond };
