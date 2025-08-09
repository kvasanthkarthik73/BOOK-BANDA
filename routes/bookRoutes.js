const express=require('express');
const router=express.Router();
const{
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getFeaturedBooks,
    searchBooks
}=require('../controllers/bookController');
const{protect,admin}=require('../middleware/auth');
router.get('/',getAllBooks);
router.get('/featured',getFeaturedBooks);
router.get('/search',searchBooks);
router.get('/:id',getBookById);

router.post('/',protect,admin,createBook);
router.put('/:id',protect,admin,updateBook);
router.delete('/:id',protect,admin,deleteBook);
module.exports = router;