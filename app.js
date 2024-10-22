const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./routes/webhookRoutes');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/webhook', webhookRoutes);

module.exports = app;
