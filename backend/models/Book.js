const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    condition: {
        type: String,
        required: true,
        enum: ['new', 'like-new', 'good', 'fair', 'poor']
    },
    language: {
        type: String,
        required: true,
        enum: ['english', 'hindi', 'other']
    },
    image: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        required: true
    },
    upiId: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    edition: {
        type: String,
        required: false
    },
    pages: {
        type: Number,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema); 