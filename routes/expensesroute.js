const express = require('express');
const router = express.Router();
const expensescontroller = require('../controllers/expensescontroller');

router.get('/expenses', expensescontroller.getexpenses);
router.post('/expenses', expensescontroller.postexpenses);
router.post('/deleteexpense', expensescontroller.deleteexpense);
module.exports = router;