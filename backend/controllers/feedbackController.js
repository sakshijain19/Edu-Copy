const Feedback = require('../models/Feedback');

// Get all feedback
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('user', 'name email');
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

// Submit new feedback
const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const feedback = new Feedback({
            user: req.user.userId,
            rating,
            comment
        });

        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

// Get feedback by ID
const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate('user', 'name email');
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
};

// Update feedback
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (feedback.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this feedback' });
        }

        const { rating, comment } = req.body;
        feedback.rating = rating;
        feedback.comment = comment;

        await feedback.save();
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Error updating feedback', error: error.message });
    }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (feedback.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this feedback' });
        }

        await feedback.remove();
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
};

module.exports = {
    getAllFeedback,
    submitFeedback,
    getFeedbackById,
    updateFeedback,
    deleteFeedback
};