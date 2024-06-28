const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/register', userService.registerUser);
router.post('/login', userService.loginUser);

module.exports = router;
