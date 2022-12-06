const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');

router.post('/signup', usercontroller.usersignup);

module.exports = router;