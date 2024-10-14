const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./routes/webhookRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/webhook', webhookRoutes);

module.exports = app;
