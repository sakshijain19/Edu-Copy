const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  createBook,
  getAllBooks,
  getBookById,
  updateBookStatus,
  deleteBook
} = require('../controllers/bookController');
const auth = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/books');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected routes
router.post('/', auth, upload.array('images', 5), createBook);
router.patch('/:id/status', auth, updateBookStatus);
router.delete('/:id', auth, deleteBook);

module.exports = router;