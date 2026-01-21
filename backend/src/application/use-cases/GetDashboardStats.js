const taskRepository = require('../../infrastructure/database/mongoose/repositories/MongoTaskRepository');

class GetDashboardStats {
    async execute(user) {
        const totalTasks = await taskRepository.countByUser(user._id);
        const completedTasks = await taskRepository.countByUser(user._id, { completed: true });
        const activeTasks = totalTasks - completedTasks;
        const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
            message: 'Welcome to your dashboard!',
            user: { email: user.email, name: user.name },
            stats: [
                { id: 1, name: 'Total Tasks', value: totalTasks.toString(), change: 'Live', type: 'increase' },
                { id: 2, name: 'Completed', value: completedTasks.toString(), change: 'Live', type: 'increase' },
                { id: 3, name: 'Active Tasks', value: activeTasks.toString(), change: 'Live', type: 'increase' },
                { id: 4, name: 'Productivity', value: `${productivity}%`, change: 'Live', type: 'increase' },
            ]
        };
    }
}

module.exports = new GetDashboardStats();
