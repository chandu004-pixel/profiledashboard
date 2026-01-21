const taskRepository = require('../../database/mongoose/repositories/MongoTaskRepository');

class TaskController {
    async createTask(req, res) {
        try {
            const { title, description } = req.body;
            if (!title) return res.status(400).json({ message: 'Title is required' });

            const task = await taskRepository.create({
                title,
                description,
                user: req.user._id
            });
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getTasks(req, res) {
        try {
            const tasks = await taskRepository.findByUser(req.user._id);
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateTask(req, res) {
        try {
            const task = await taskRepository.update(req.params.id, req.user._id, req.body);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteTask(req, res) {
        try {
            const task = await taskRepository.delete(req.params.id, req.user._id);
            if (!task) return res.status(404).json({ message: 'Task not found' });
            res.json({ message: 'Task deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new TaskController();
