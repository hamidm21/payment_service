const express = require('express');
const router = express.Router();
const controller = require('../lib/controllers/transaction_controller');

router.post('/Payment', controller.payment);

router.post('/PaymentCheck', controller.paymentCheck);

router.get('/PaymentResult', controller.paymentVerification);

module.exports = router;