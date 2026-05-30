const express = require('express');
const connectDb=require("./config/database");
const app = express();
const cookieParser=require('cookie-parser');

require("dotenv").config();


app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

connectDb().then(()=>{
    console.log("database connected successfully");
    app.listen(process.env.PORT,()=>{
    console.log("Server is successfully listening on port:",process.env.PORT);
});
}).catch((err)=>{
    console.error("database connection failed");
})