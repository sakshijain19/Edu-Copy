const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/books');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// List a book for sale
router.post('/list', auth, upload.single('image'), async (req, res) => {
    try {
        const { 
            title, 
            author, 
            description, 
            price, 
            condition, 
            language,
            location,
            upiId,
            phone,
            edition,
            pages
        } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a book image' });
        }

        const book = new Book({
            title,
            author,
            description,
            price,
            condition,
            language,
            location,
            upiId,
            phone,
            edition,
            pages,
            image: `/uploads/books/${req.file.filename}`,
            seller: req.user.userId
        });

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error listing book', error: error.message });
    }
});

// Get all books
router.get('/', async (req, res) => {
    try {
        const { 
            language, 
            condition, 
            minPrice, 
            maxPrice, 
            search,
            location 
        } = req.query;
        let query = {};

        if (language) query.language = language;
        if (condition) query.condition = condition;
        if (location) query.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const books = await Book.find(query)
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// Get book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('seller', 'name email');
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error: error.message });
    }
});

// Update book listing
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this book' });
        }

        const updates = { ...req.body };
        if (req.file) {
            updates.image = `/uploads/books/${req.file.filename}`;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
});

// Delete book listing
router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.seller.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this book' });
        }

        await book.remove();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
});

// Send message to seller
router.post('/:id/message', auth, async (req, res) => {
    try {
        const { message, buyerPhone } = req.body;
        const book = await Book.findById(req.params.id)
            .populate('seller', 'name email phone');
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Here you would typically:
        // 1. Save the message to a database
        // 2. Send a notification to the seller
        // 3. Send an email/SMS to the seller
        
        res.json({ 
            message: 'Message sent successfully',
            sellerPhone: book.seller.phone,
            bookTitle: book.title,
            buyerMessage: message,
            buyerPhone: buyerPhone
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
});

module.exports = router; 