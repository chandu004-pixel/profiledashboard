const bcrypt = require('bcryptjs');
const userRepository = require('../../infrastructure/database/mongoose/repositories/MongoUserRepository');

class SignupUser {
    async execute({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepository.create({ email, password: hashedPassword });
    }
}

module.exports = new SignupUser();
