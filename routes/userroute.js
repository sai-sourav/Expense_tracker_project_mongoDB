const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.post('/signup', usercontroller.usersignup);

router.post('/signin', usercontroller.usersignin);

module.exports = router;