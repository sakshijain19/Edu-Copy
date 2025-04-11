const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, checkDBStatus } = require('./db');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Test route to check database connection
app.get('/api/test/db', async (req, res) => {
    try {
        const dbStatus = await checkDBStatus();
        res.json(dbStatus);
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            error: error.message,
            stack: error.stack
        });
    }
});

// Test route to create a sample user
app.post('/api/test/user', async (req, res) => {
    try {
        const User = require('./models/User');
        const testUser = new User({
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        });
        
        const savedUser = await testUser.save();
        res.json({
            message: 'Test user created successfully',
            user: savedUser
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            error: error.message,
            stack: error.stack
        });
    }
});

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const notesRoutes = require('./routes/notes');
const questionPapersRoutes = require('./routes/questionPapers');
const feedbackRoutes = require('./routes/feedback');

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/question-papers', questionPapersRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: Object.values(err.errors).map(e => e.message).join(', ')
        });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        return res.status(400).json({
            status: 'error',
            message: 'Email already exists'
        });
    }

    // Handle other errors
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
});