const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');
const userauthentication = require('../middlewares/auth');
router.post('/signup', usercontroller.usersignup);

router.post('/signin', usercontroller.usersignin);

router.get('/password/forgotpassword/:emailid', usercontroller.forgotpassword);

router.post('/password/resetpassword', usercontroller.resetpassword);

router.get('/lifetime', userauthentication.authenticate, usercontroller.getlifetimedata );

router.get('/leaderboard', usercontroller.getleaderboard);

module.exports = router;