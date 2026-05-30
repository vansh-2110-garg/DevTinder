const express = require('express');
const {validateSignUpData}=require("../utils/validation");
const bcrypt = require('bcrypt');
const validator=require('validator');
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup",async(req,res)=>{

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

authRouter.post("/login",async(req,res)=>{
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

module.exports = authRouter;