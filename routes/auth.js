const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/google', authController.googleAuth);
router.post('/signin', authController.regularSignIn);

module.exports = router; 