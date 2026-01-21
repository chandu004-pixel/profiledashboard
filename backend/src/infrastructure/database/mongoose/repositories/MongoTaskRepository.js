const Task = require('../models/Task');

class MongoTaskRepository {
    async create(taskData) {
        const task = new Task(taskData);
        return await task.save();
    }

    async findByUser(userId) {
        return await Task.find({ user: userId }).sort({ createdAt: -1 });
    }

    async findByIdAndUser(id, userId) {
        return await Task.findOne({ _id: id, user: userId });
    }

    async update(id, userId, updateData) {
        return await Task.findOneAndUpdate(
            { _id: id, user: userId },
            updateData,
            { new: true }
        );
    }

    async delete(id, userId) {
        return await Task.findOneAndDelete({ _id: id, user: userId });
    }

    async countByUser(userId, filter = {}) {
        return await Task.countDocuments({ user: userId, ...filter });
    }
}

module.exports = new MongoTaskRepository();
