const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/signup', (req, res) => authController.signup(req, res));
router.post('/login', (req, res) => authController.login(req, res));

module.exports = router;
