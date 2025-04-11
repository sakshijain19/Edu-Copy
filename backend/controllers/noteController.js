const Note = require('../models/Note');
const fs = require('fs');
const path = require('path');

// Upload a new note
exports.uploadNote = async (req, res) => {
    try {
        const { title, description, subject, semester } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const note = new Note({
            title,
            description,
            subject,
            semester,
            filePath: file.path,
            uploadedBy: req.user.userId
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error('Error uploading note:', error);
        res.status(500).json({ message: 'Error uploading note' });
    }
};

// Get all notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find().populate('uploadedBy', 'name email');
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

// Get a specific note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id).populate('uploadedBy', 'name email');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Error fetching note' });
    }
};

// Download a note
exports.downloadNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const filePath = path.join(__dirname, '..', note.filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Error downloading note:', error);
        res.status(500).json({ message: 'Error downloading note' });
    }
};

// Add a review to a note
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const review = {
            user: req.user.userId,
            rating,
            comment
        };

        note.reviews.push(review);
        await note.save();

        res.json(note);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
};