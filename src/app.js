const express = require('express');
const connectDb=require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignUpData}=require("./utils/validation");
const bcrypt = require('bcrypt');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const validator=require('validator');
const {userAuth}=require('./middlewares/auth');
require("dotenv").config();


app.use(express.json());

app.use(cookieParser());

app.post("/signup",async(req,res)=>{

    try{
        //validate the data
        validateSignUpData(req);

        //encrypt the password
        const {firstName,lastName,email,password } = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        //creating a new instance of user model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!validator.isEmail(email)) {
            throw new Error("Invalid Email");
        }

        const user = await User.findOne({email});
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            
            const token = await user.getJWT();
            res.cookie("token",token,{
                expires:new Date(Date.now() + 168 * 3600000)
            });
            res.send("User Login successful");
        }
        else{
            throw new Error("Invalid credentials");
        }

    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/profile",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user = req.user;
    //sending a connection request
    res.send(user.firstName + " sent the connection request!");
})

connectDb().then(()=>{
    console.log("database connected successfully");
    app.listen(process.env.PORT,()=>{
    console.log("Server is successfully listening on port 3000...");
});
}).catch((err)=>{
    console.error("database connection failed");
})