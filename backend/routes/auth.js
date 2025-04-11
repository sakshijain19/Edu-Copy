const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register route - POST /api/auth/register
router.post('/register', authController.register);

// Login route - POST /api/auth/login
router.post('/login', authController.login);

// Verify token route - GET /api/auth/verify
router.get('/verify', auth, authController.verify);

// Get profile route - GET /api/auth/profile
router.get('/profile', auth, authController.getProfile);

// Update profile route - PUT /api/auth/profile
router.put('/profile', auth, authController.updateProfile);

module.exports = router;