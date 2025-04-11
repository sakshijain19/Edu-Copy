const express = require('express');
const router = express.Router();
const { 
  uploadNote,
  getAllNotes,
  getNoteById,
  downloadNote,
  addReview
} = require('../controllers/noteController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/notes');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getAllNotes);
router.get('/:id', getNoteById);

// Protected routes
router.post('/', auth, upload.single('file'), uploadNote);
router.get('/:id/download', auth, downloadNote);
router.post('/:id/review', auth, addReview);

module.exports = router; 