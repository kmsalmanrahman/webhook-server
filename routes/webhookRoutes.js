const express = require('express');
const { handleWebhook, getWebhookResponses } = require('../controllers/webhookControllers');

const router = express.Router();

router.post('/', handleWebhook);
router.get('/view', getWebhookResponses);

module.exports = router;
