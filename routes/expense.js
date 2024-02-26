const expenseControllers = require('../controllers/expense');
const express = require('express');
const router = express.Router();

router.post('/',expenseControllers.postAddExpense);
router.get('/delete/:id',expenseControllers.getDeleteExpense);
router.get('/data',expenseControllers.getAllData);

module.exports = router;