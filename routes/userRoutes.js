const userControllers = require('../controller/userController');

const express = require('express');
const router = express.Router();

router.get('/adduser',userControllers.postAddUsers);
router.get('/login',userControllers.postLoginUser)
router.post('/adduser', userControllers.postAddUsers);
router.post('/login', userControllers.postLoginUser);


module.exports = router;