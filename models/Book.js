const mongoose = require('mongoose');
const { validate } = require('./User');
const bookSchema = new mongoose.Schema({
    title: {
        type:String,
        required:[true,'Title is required'],
        trim:true,
        maxlength:[300,'Tile cannot exceed 300 characters']
    },
    author: {
        type:String,
        required:[true,'Author is required'],
        trim:true,
        maxlength:[100,'Tile cannot exceed 300 characters']
    },
    description: {
        type:String,
        required:[true,'Description is required'],
        trim:true,
        maxlength:[4000,'Tile cannot exceed 300 characters']
    },
    ibsn: {
        type:String,
        required:[true,'IBSN is required'],
        unique:true,
        trim:true,
        validate:{
            validator:function(v){
                const isbnval = v.replace(/-/g,'');
                return isbnval.length ===10 ||  isbnval.length ===13;
            },
            message:'ISBN must be 10 or 13 digits long'
        }
    },
    coverImage:{
    type:String,
    default:''
    },
   genre: [{
        type: String,
        trim: true,
        enum: [
            'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 
            'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help',
            'Business', 'Technology', 'Cooking', 'Travel', 'Poetry', 'Drama',
            'Horror', 'Adventure', 'Children', 'Young Adult', 'Classic',
            'Contemporary', 'Historical Fiction', 'Memoir', 'Philosophy',
            'Psychology', 'Science', 'Health', 'Education', 'Art', 'Music'
        ]
    }],

    languages:{
        type:String,
        default:'English',
        trim:true
    },
    publisher:{
        type:String,
        trim:true
    },
    publishDate:{
        type:Date
    },
    totalPages:{
        type:Number,
        min:[1,'Total pages must be atleast 1']
    },
    rating:{
        type:Number,
        min:[0,'Rating can be lesser than 0'],
        max:[5,'Rating must be lesser than 5'],
        default:0
    },
    numberOfRatings:{
        type: Number,
        default:0,
        min:[0,'Number of ratings cannot be negative']
    },
    featured:{
        type:Boolean,
        default:false
    }
},{timestamps:true}
);
//Index for searching 
bookSchema.index({title:'text',author:'text',description:'text'});
//average rating -A virtual is like a calculated property that doesn't exist in the database but is computed on-the-fly.
bookSchema.virtual('averageRating').get(function(){return this.numberOfRatings>0?(this.rating/this.numberOfRatings).toFixed(1):0;});
bookSchema.set('toJSON',{virtual:true});
bookSchema.set('toObject',{virtual:true});

module.exports=mongoose.model('Book',bookSchema);