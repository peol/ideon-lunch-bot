# ideon-lunch-bot

Slack bot for fetching lunch menus in the Ideon area and letting people vote on their favorite.

Requires a Slack bot token together with a slash command to port 6445 if you want Slack integration.

```bash
npm i
SLACK_TOKEN=xoxp-token node index
```

## Spec

See other places for implementation, but in essence:

```js
module.exports = {
  url: '', // url to fetch _this weeks_ lunch
  raw: false, // true if you the url above returns something else than HTML and you want to parse it yourself
  // or raw data, should return an array with five arrays (each day):
  // [ [{ type: 'Dagens', dish: 'Potatis', price: 90 }], [], [], [], [] ]
  parse: async (html) => {},
};
```
