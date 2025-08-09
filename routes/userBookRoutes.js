const express = require('express');
const router = express.Router();
const {
    addBooktoList,
    getUserBooks,
    updateReadingProgress,
    updateBookStatus,
    addRatingAndReview,
    removeBookFromList,
    getReadingStats,
    addNotes
} = require('../controllers/userBookController');
const { protect,admin } = require('../middleware/auth');

// All routes require authentication
router.use(protect);
router.post('/add', addBooktoList);
router.get('/my-books', getUserBooks);
router.put('/:bookId/progress', updateReadingProgress);
router.put('/:bookId/status', updateBookStatus);
router.put('/:bookId/rating-review', addRatingAndReview);
router.put('/:bookId/notes', addNotes);
router.delete('/:bookId', removeBookFromList);
router.get('/stats/reading', getReadingStats);

module.exports = router;