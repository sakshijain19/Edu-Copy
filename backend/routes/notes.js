import express from 'express';
import multer from 'multer';
import path from 'path';
import Note from '../models/Note.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for PDF upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/notes');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'));
        }
    }
});

// Upload notes
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        const { title, description, subject, course, semester } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file' });
        }

        const note = new Note({
            title,
            description,
            subject,
            course,
            semester,
            fileUrl: `/uploads/notes/${req.file.filename}`,
            uploadedBy: req.user.userId
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error uploading notes', error: error.message });
    }
});

// Get all notes
router.get('/', async (req, res) => {
    try {
        const { subject, course, semester, search } = req.query;
        let query = {};

        if (subject) query.subject = subject;
        if (course) query.course = course;
        if (semester) query.semester = Number(semester);
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const notes = await Note.find(query)
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
    }
});

// Get note by ID
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('uploadedBy', 'name email')
            .populate('reviews.user', 'name');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note', error: error.message });
    }
});

// Download note
router.get('/:id/download', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Increment download count
        note.downloads += 1;
        await note.save();

        // Send file
        res.download(path.join(__dirname, '..', note.fileUrl));
    } catch (error) {
        res.status(500).json({ message: 'Error downloading note', error: error.message });
    }
});

// Add review
router.post('/:id/review', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Add review
        note.reviews.push({
            user: req.user.userId,
            rating,
            comment
        });

        // Update average rating
        const totalRating = note.reviews.reduce((sum, review) => sum + review.rating, 0);
        note.rating = totalRating / note.reviews.length;

        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.uploadedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this note' });
        }

        await note.remove();
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
    }
});

export default router; 