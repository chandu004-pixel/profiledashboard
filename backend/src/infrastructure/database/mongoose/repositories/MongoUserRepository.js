const User = require('../models/User');

class MongoUserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id);
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }
}

module.exports = new MongoUserRepository();
