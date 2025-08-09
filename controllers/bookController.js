const Book = require('../models/Book');
const UserBook = require('../models/UserBook');
//get books with pagination
const getAllBooks = async(req,res)=>{
    try{
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        const skip = (page-1)*limit; // Example of skip:Page 3 with 10 books per page = skip (3-1) * 10 = 20 books .This skips the first 20 books to show books 21-30
        const filter ={};
        //search
        if(req.query.search){
            filter.$text={$search:req.query.search}
        }
        //genre filter
        if(req.query.genre){
            filter.genre=req.query.genre;
        }
        //author filter
        if(req.query.author){
            filter.author={$regex:req.query.author, $options:'i'}//$options: 'i' makes it case-insensitive
        }
        //featured filter
        if(req.query.featured==='true'){
            filter.featured=true;
        }
        const books = await Book.find(filter).skip(skip).limit(limit).sort({createdAt:-1});
        const total = await Book.countDocuments(filter);
        res.json({
            books,
            pagination:{
                currentPage:page,
                totalPages:Math.ceil(total/limit),
                totalBooks:total,
                hasNext:page*limit<total,
                hasPrev:page>1
            }
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};

const getBookById=async(req,res)=>{
    try{
        const book=await Book.findById(req.params.id);
        if(!book){
            return res.status(404).json({message:'Book not found'});
        }
        res.json(book);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};
const createBook=async(req,res)=>{
    try{
        const book = await Book.create(req.body);
        res.status(201).json(book);
    }catch(error){
        console.error(error);
        res.status(500).json('Server error');
    }
};
const updateBook=async(req,res)=>{
    try{
        const book = await Book.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!book){
            return res.status(404).json({message:'Book notfound'});
        }
        res.json(book);
        }catch(error){
            console.error(error);
            res.status(500).json({message:'Server error'});
        }
};

const deleteBook=async(req,res)=>{
    try{
        const book = await Book.findByIdAndDelete(req.params.id);
        if(!book){
            return res.status(404).json({message:'Book not found'});
        }
        res.json(book);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};

const getFeaturedBooks=async(req,res)=>{
    try{
        const book = await Book.find({featured:true}).sort({createdAt:-1}).limit(10);
        res.json(book);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};

const searchBooks=async(req,res)=>{
    try{
        const{q}=req.query;
        if(!q){return res.status(400).json({message:'Search query is required'});}
        const books = await Book.find({$text:{$search:q}},
            {score:{$meta:'textScore'}}).sort({score:{$meta:'textScore'}}).limit(20);
        res.json(books);
    }catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
};
module.exports={getAllBooks,getBookById,createBook,updateBook,deleteBook,getFeaturedBooks,searchBooks};