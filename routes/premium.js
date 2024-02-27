const express = require('express');
const router = express.Router();
const userAuthentication = require('../middleware/auth')
const premiumControllers = require('../controllers/premium');

router.get('/leaderboard',userAuthentication.authenticate,premiumControllers.leaderboard);

module.exports = router;