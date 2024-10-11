// controllers/webhookController.js

const handleWebhook = (req, res) => {
    console.log('Webhook received!');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.status(200).json({ message:'Webhook received successfully!', responseHeader: req.headers, responseBody: req.body });
  };
  
  module.exports = { handleWebhook };
  