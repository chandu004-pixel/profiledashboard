const signupUser = require('../../../application/use-cases/SignupUser');
const loginUser = require('../../../application/use-cases/LoginUser');

class AuthController {
    async signup(req, res) {
        try {
            await signupUser.execute(req.body);
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(error.message === 'User already exists' ? 400 : 500).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const data = await loginUser.execute(req.body);
            res.json(data);
        } catch (error) {
            res.status(error.message === 'Invalid email or password' ? 401 : 500).json({ message: error.message });
        }
    }
}

module.exports = new AuthController();
