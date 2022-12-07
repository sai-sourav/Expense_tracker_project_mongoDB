const express = require('express');
const router = express.Router();
const expensescontroller = require('../controllers/expensescontroller');
const userauthentication = require('../middlewares/auth');

router.get('/expenses', userauthentication.authenticate, expensescontroller.getexpenses);
router.post('/expenses', userauthentication.authenticate, expensescontroller.postexpenses);
router.post('/deleteexpense', userauthentication.authenticate, expensescontroller.deleteexpense);
module.exports = router;