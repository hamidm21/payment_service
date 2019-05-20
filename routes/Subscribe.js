const express = require('express');
const router = express.Router();
const controller = require('../lib/controllers/subscribe_controller');

// router.post('/CreateSubscribe', controller.createSubscribe);

router.get('/GetSubscribes', controller.getSubscribes);

module.exports = router;