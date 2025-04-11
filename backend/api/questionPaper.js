const express = require('express');
const router = express.Router();
const { 
  uploadQuestionPaper,
  getQuestionPapers,
  getQuestionPaperById,
  downloadQuestionPaper
} = require('../controllers/questionPaperController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/question-papers');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Public routes
router.get('/', getQuestionPapers);
router.get('/:id', getQuestionPaperById);

// Protected routes
router.post('/', auth, upload.single('file'), uploadQuestionPaper);
router.get('/:id/download', auth, downloadQuestionPaper);

module.exports = router; 