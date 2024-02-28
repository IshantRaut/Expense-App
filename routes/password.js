const express = require('express');
const router = express.Router();
const passwordController = require('../controller/password');

router.get('/forgotpassword',passwordController.resetpassword);


module.exports = router;