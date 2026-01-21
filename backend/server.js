require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./src/infrastructure/web/routes/authRoutes');
const userRoutes = require('./src/infrastructure/web/routes/userRoutes');
const taskRoutes = require('./src/infrastructure/web/routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lightweight-backend')
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            // Drop the problematic username index if it exists
            const collections = await mongoose.connection.db.listCollections({ name: 'users' }).toArray();
            if (collections.length > 0) {
                await mongoose.connection.db.collection('users').dropIndex('username_1').catch(err => {
                    // Ignore error if index doesn't exist
                    if (err.code !== 27) console.log('Username index check:', err.message);
                });
            }
        } catch (err) {
            console.error('Error handling indexes:', err);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
