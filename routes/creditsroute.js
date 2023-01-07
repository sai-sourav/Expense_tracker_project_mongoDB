const express = require('express');
const router = express.Router();
const creditscontroller = require('../controllers/creditscontroller');
const userauthentication = require('../middlewares/auth');

// router.get('/premium/credits', userauthentication.authenticate, creditscontroller.getpremiumcredits);
// router.get('/credits', userauthentication.authenticate, creditscontroller.getcredits);
// router.post('/credits', userauthentication.authenticate, creditscontroller.postcredit);
// router.post('/deletecredit', userauthentication.authenticate, creditscontroller.deletecredit);
module.exports = router;