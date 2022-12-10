const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.post('/signup', usercontroller.usersignup);

router.post('/signin', usercontroller.usersignin);

router.get('/password/forgotpassword/:emailid', usercontroller.forgotpassword);

router.post('/password/resetpassword', usercontroller.resetpassword);

module.exports = router;