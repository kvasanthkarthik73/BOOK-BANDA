const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req,res,next)=>{
    let token;
    console.log('=== AUTH DEBUG ===');
    console.log('Full headers:', JSON.stringify(req.headers, null, 2));
    console.log('Authorization header:', req.headers.authorization);
    console.log('Authorization header type:', typeof req.headers.authorization);

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){//Jwt tokens are sent as "Bearer TOKEN"
        try{
            token = req.headers.authorization.split(' ')[1];
            console.log('1. Extracted token:', token);
           
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('2. Decoded payload:', decoded);

            req.user = await User.findById(decoded.id).select('-password');
            console.log('Found user:', req.user ? 'Yes' : 'No');

            next();
        }
        catch(error){
            console.error('=== JWT VERIFY ERROR DETAILS ===');
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Token that failed:', token);
            console.error('JWT_SECRET used:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
            console.error('========================');
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req,res,next)=>{
    if(req.user && req.user.role==='admin'){
        next();

    }
    else{
        res.status(401).json({message:'Not Authorized as an admin'})
    }
};
module.exports={protect,admin};
