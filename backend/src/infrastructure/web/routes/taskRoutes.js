const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, (req, res) => taskController.createTask(req, res));
router.get('/', authMiddleware, (req, res) => taskController.getTasks(req, res));
router.put('/:id', authMiddleware, (req, res) => taskController.updateTask(req, res));
router.delete('/:id', authMiddleware, (req, res) => taskController.deleteTask(req, res));

module.exports = router;
