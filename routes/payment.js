const express = require('express');
const router = express.Router();
const paymentcontroller = require('../controllers/payment');
const userauthentication = require('../middlewares/auth');

// router.get('/premiummembership', userauthentication.authenticate, paymentcontroller.purchasepremium);

// router.post('/updatetransactionstatus', userauthentication.authenticate, paymentcontroller.updateTransactionStatus)

module.exports = router;