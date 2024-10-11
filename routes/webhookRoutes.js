// routes/webhookRoutes.js
const express = require('express');
const { handleWebhook } = require('../controllers/webhookControllers');

const router = express.Router();

// POST route for the webhook
router.post('/', handleWebhook);

module.exports = router;
