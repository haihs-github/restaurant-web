const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
//POST /api/auth/register
//dangky
//public
router.post('/register', authController.register);

//POST /api/auth/login
//dang nhap
//public
router.post('/login', authController.login);

module.exports = router;
