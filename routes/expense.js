const expenseControllers = require('../controllers/expense');
const userAuthentication= require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/',userAuthentication.authenticate,expenseControllers.postAddExpense);
router.get('/delete/:id',expenseControllers.getDeleteExpense);
router.get('/data',userAuthentication.authenticate,expenseControllers.getAllData);

module.exports = router;