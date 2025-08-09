const express= require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
// Connect
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/api/auth',require('./routes/authRoutes'));
const PORT = process.env.PORT || 5000;
app.get('/',(req,res)=>{res.send('hello world,the authentication with jwt is working')});
app.listen(PORT,()=>console.log(`server is running on ${PORT}`));