const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');
const userauthentication = require('../middlewares/auth');
router.post('/signup', usercontroller.usersignup);

router.post('/signin', usercontroller.usersignin);

router.get('/password/forgotpassword/:emailid', usercontroller.forgotpassword);

router.post('/password/resetpassword', usercontroller.resetpassword);

router.get('/lifetime', userauthentication.authenticate, usercontroller.getlifetimedata );

router.get('/leaderboard', userauthentication.authenticate, usercontroller.getleaderboard);

router.get('/download', userauthentication.authenticate, usercontroller.downloadExpenses);

router.get('/downloadhistory', userauthentication.authenticate, usercontroller.getdownloadhistory);

module.exports = router;