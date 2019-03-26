const express = require('express');
const bodyParser = require('body-parser');
const { respond } = require('./slack');

const app = express();
const port = 6445;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', respond);

app.listen(port, () => console.log(`Server listening on port ${port}!`));
