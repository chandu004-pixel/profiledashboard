const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.get('/dashboard', authMiddleware, (req, res) => userController.getDashboard(req, res));

module.exports = router;
