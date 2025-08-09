const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        console.log('MONGODB_URL from env:', process.env.MONGODB_URL);
        const conn = await mongoose.connect(process.env.MONGODB_URL);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }

};

module.exports = connectDB;