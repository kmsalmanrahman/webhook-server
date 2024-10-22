const express = require('express');
const { handleWebhook, getWebhookResponses, clearWebhookResponses } = require('../controllers/webhookControllers');


const router = express.Router();

router.post('/', handleWebhook);
router.get('/view', getWebhookResponses);
router.post('/clear', clearWebhookResponses);

module.exports = router;
