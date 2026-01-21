const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../../infrastructure/database/mongoose/repositories/MongoUserRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

class LoginUser {
    async execute({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await userRepository.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                bio: user.bio
            }
        };
    }
}

module.exports = new LoginUser();
