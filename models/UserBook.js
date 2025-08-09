const  mongoose = require("mongoose");
const userBookSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Book',
        required:true
    },
    status:{
        type:String,
        enum:['tbr','currently-reading','read','favourites']
    },
    pagesRead:{
        Type:Number,
        default:0,
        min:[0,'Pages Read cannot be negative']
    },
    startDate:{
        type:Date,
        default:Date.now
    },
    endDate:{
        type:Date,
       
    },
    rating:{
        type:Number,
        min:[0,'Rating cannot be negative'],
        max:[5,'Rating cannot exceed 5']
    },
    review:{
        type:String,
        maxlength:[4000,'Review cannot exceed 4000 words']
    },
    notes:{
        type:String,
        maxlength:[400,'Notes cannot exceed 400 words']
    },
    isFavourite:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

userBookSchema.index({user:1,book:1},{unique:true});
userBookSchema.virtual('progressPercentage').get(function(){
    if(!this.book || !this.book.totalPages) return 0;
    return Mathround((this.pagesRead/this.book.totalPages)*100);
});
userBookSchema.set('toJSON',{virtual:true});
userBookSchema.set('toObject',{virtual:true});
module.exports=mongoose.model('UserBook'.userBookSchema);

