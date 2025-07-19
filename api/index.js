import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from './error/error.js';
import session from 'express-session';
const app=express();

app.use(express.json());;
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow requests from this origin only
  }));

mongoose.connect('mongodb+srv://swathy:swathy@tpc-project.w1d0i.mongodb.net/tpc-project?retryWrites=true&w=majority&appName=tpc-project').then(
    ()=>{console.log('mongodb is connected')}).catch(err=>{
        console.log(err);
    })

app.listen(3000,()=>{
    console.log('server is running on port 3000');
})
app.use('/api/user',userRoutes);
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });
  app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,              // Forces the session to be saved back to the session store
    saveUninitialized: true,    // Forces an uninitialized session to be saved to the store
    cookie: { secure: false }   // Set to true if using HTTPS
  }));