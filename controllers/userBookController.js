const UserBook = require('../models/UserBook');
const Book = require('../models/Book');
const addBooktoList=async(req,res)=>{
    try{
        const {bookId,status,pagesRead,startDate,endDate,rating,review,notes,isFavourite}=req.body;
        const book = await Book.findById(bookId);
        if(!book){
            return res.status(404).json({message:'Book not found'});
        }
        const existingUserBook = await UserBook.findOne({
            user:req.user._id,
            book:bookId
        });
        if(existingUserBook){
            if(status) existingUserBook.status=status;
            if(pagesRead) existingUserBook.pagesRead=pagesRead;
            if(startDate) existingUserBook.startDate=startDate;
            if(endDate) existingUserBook.endDate=endDate;
            if(rating) existingUserBook.rating=rating;
            if(review) existingUserBook.review=review;
            if(notes) existingUserBook.notes=notes;
            if(isFavourite) existingUserBook.isFavourite=isFavourite;
            if(notes) existingUserBook.notes=notes;
            await existingUserBook.save();
            await existingUserBook.populate('book');
            return res.json(existingUserBook);
        }

        const userBook=await UserBook.create({
            user: req.user._id,
            book: bookId,
            ...(status && { status }),
            pagesRead: pagesRead || 0,
            ...((status === 'currently-reading' || status === 'read') && { 
                startDate: startDate || new Date() 
            }),
            ...(status === 'read' && { 
                finishDate: endDate || new Date() 
            }),
            rating,
            review,
            notes,
            isFavourite: isFavourite || false
        });
        await userBook.populate('book');
        res.status(201).json(userBook);
        }catch(error){
            console.error(error);
            res.status(500).json({message:'Server error'});
        }
};
// Get user's books by status
const getUserBooks = async (req, res) => {
    try {
        const {status} = req.query;
        const filter = { user: req.user._id }; 
        if (status) {
            filter.status = status;
        }
        const userBooks = await UserBook.find(filter)
            .populate('book')
            .sort({ updatedAt: -1 });
            
        res.json(userBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateReadingProgress=async(req,res)=>{
    try{
        const{pagesRead}=req.body;
        const {bookId}= req.params;
        const userBook=await UserBook.findOne({
            user:req.user._id,
            book:bookId
        });
        if(!userBook){return res.status(404).json({message:'Book not found in your list'});}
        const book = await Book.findById(bookId);
        if(pagesRead>book.totalPages){return res.status(400).json({message:'Pages read cannot exceed total pages'});}
        userBook.pagesRead=pagesRead;
        if (pagesRead == book.totalPages) {
            userBook.status = 'read';
            userBook.finishDate = new Date();
        }
        await userBook.save();
        await userBook.populate('book');
        res.json(userBook);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};
// Update book status
const updateBookStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { bookId } = req.params;
        
        const userBook = await UserBook.findOne({
            user: req.user._id,
            book: bookId
        });
        
        if (!userBook) {
            return res.status(404).json({ message: 'Book not found in your list' });
        }
        
        userBook.status = status;
        
        if (status === 'read') {
            userBook.finishDate = new Date();
        }
        
        await userBook.save();
        await userBook.populate('book');
        
        res.json(userBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addRatingAndReview=async(req,res)=>{
    try{
        const{rating,review}=req.body;
        const{bookId}=req.params;
        const userBook=await UserBook.findOneAndDelete({
            user:req.user._id,
            book:bookId
        });
        if(!userBook){return res.status(404).json({message:'Book not found in your list'});}
        userBook.rating=rating;
        userBook.review=review;
        await userBook.save();
        const book = await Book.findById(bookId);
        const allRatings=await UserBook.find({book:bookId}).select('rating');
        const totalRatings=allRatings.reduce((sum,rating)=>sum+rating,0);
        book.rating=totalRatings;
        book.numberOfRatings=allRatings.length;
        await book.save();
        await userBook.populate('book');
        res.json(userBook);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};

const addNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const { bookId } = req.params;
        
        const userBook = await UserBook.findOne({
            user: req.user._id,
            book: bookId
        });
        
        if (!userBook) {
            return res.status(404).json({ message: 'Book not found in your list' });
        }
        
        userBook.notes = notes;
        await userBook.save();
        await userBook.populate('book');
        
        res.json(userBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeBookFromList=async(req,res)=>{
    try{
        const{bookId}=req.params;
        const userBook=await UserBook.findOneAndDelete({
            user:req.user._id,  
            book:bookId
        });
        if(!userBook){return res.status(404).json({message:'Book not found in your list'})}
        res.json({message:'Book removed from your list'});
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};

const getReadingStats=async(req,res)=>{
    try{
        const{bookId}=req.params;
        const userBook=await UserBook.findOne({
            user:req.user_id,
            book:bookId
        });
        if(!userBook){return res.status(404).json({message:'Book not found in your list'})}
        await userBook.populate('book');
        const stats={
            totalBooks: userBooks.length,
            tbr:userBook.filter(ub=>ub.status==='tbr').length,
            currentlyReading:userBook.filter(ub=>ub.status==='currently-reading').length,
            read:userBook.filter(ub=>ub.status==='read').length,
            favourites:userBook.filter(ub=>ub.isFavourite).length,
            totalPagesRead:userBook.reduce((sum,ub)=>sum+ub.pagesRead,0),
            averageRating:0
        };
        const ratedBooks = userBooks.filter(ub=>ub.rating);
        if (ratedBooks.length > 0) {
            stats.averageRating = (ratedBooks.reduce((sum, ub) => sum + ub.rating, 0) / ratedBooks.length).toFixed(1);
        }
        res.json(stats);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};
module.exports = {
    addBooktoList,
    getUserBooks,
    updateReadingProgress,
    updateBookStatus,
    addRatingAndReview,
    removeBookFromList,
    getReadingStats,
    addNotes  // ← Add this
};
