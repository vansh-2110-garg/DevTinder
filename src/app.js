const express = require('express');
const connectDb=require("./config/database");
const User = require("./models/user");
const app = express();
const {validateSignUpData}=require("./utils/validation");
const bcrypt = require('bcrypt');
const validator=require('validator');
require("dotenv").config();


app.use(express.json());

app.post("/signup",async(req,res)=>{

    try{
        console.log(req.body);
        //validate the data
        validateSignUpData(req);

        //encrypt the password
        const {firstName,lastName,email,password } = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);

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

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            res.send("User Login successful");
        }
        else{
            res.send("Invalid credentials");
        }

    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

//get user by email
app.get("/user",async (req,res)=>{
    const userEmail=req.body.email;
    try{
        const users=await User.find({email:userEmail});
        if(users.length==0){
            res.status(404).send("User not found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

// Feed API - GET /feed - get all the users from the database
app.get("/feed",async(req,res)=>{
    
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

// delete user by id
app.delete("/user",async (req,res)=>{
    const userId=req.body.userId;
    try{
        const users=await User.findByIdAndDelete(userId);
        res.send("User Deleted Successfully");
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
})

//Update data of a user
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try{
        const ALLOWED_UPDATES=["photoUrl","gender","about","age","skills"];
        const isUpdateAllowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills?.length>10){
            throw new Error("skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate(userId,data,{
            returnDocument:"before",
            runValidators:true,
        });
        console.log(user);
        res.send("user updated successfully");
    } catch(err){
        res.status(400).send("Update failed "+err.message);
    }
})

connectDb().then(()=>{
    console.log("database connected successfully");
    app.listen(process.env.PORT,()=>{
    console.log("Server is successfully listening on port 3000...");
});
}).catch((err)=>{
    console.error("database connection failed");
})

