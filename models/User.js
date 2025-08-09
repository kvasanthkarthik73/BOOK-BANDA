const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Name is mandatory'],
        trim: true
    },
    email:{
        type:String,
        require:[true, 'Email is mandatory'],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true,'Password is mandatory'],
        minlength:[5,'Password must be at least 5 characters long'],
        unique:true,
        trim:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    isActive:{
        type:Boolean,
        default:true
    }

},
{timestamps:true}
);

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next(); // hashing occurs only when pwd is again modified and return next() will come out of the function when pwd is not modified
    }

    try{
        const salt = await bcrypt.genSalt(10);
        this.password  = await bcrypt.hash(this.password,salt);
        next();
    }
    catch(error){
        console.error('Password hashing error:', error.message);
        next(error);
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

userSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    return user;
}

module.exports= mongoose.model('User',userSchema);