const getDashboardStats = require('../../../application/use-cases/GetDashboardStats');
const userRepository = require('../../database/mongoose/repositories/MongoUserRepository');

class UserController {
    getProfile(req, res) {
        res.json({
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            bio: req.user.bio
        });
    }

    async updateProfile(req, res) {
        try {
            const { name, bio } = req.body;
            const updatedUser = await userRepository.update(req.user._id, { name, bio });

            res.json({
                message: 'Profile updated',
                user: {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    bio: updatedUser.bio
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getDashboard(req, res) {
        try {
            const stats = await getDashboardStats.execute(req.user);
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
