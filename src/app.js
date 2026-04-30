const express = require('express');
const connectDb=require("./config/database");
const User = require("./models/user");
const app = express();
require("dotenv").config();


app.use(express.json());

app.post("/signup",async(req,res)=>{
    //creating a new instance of user model
    const user= new User(req.body);

    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Error Saving the user" + err.message);
    }
});

app.get("/user",async (req,res)=>{
    const userEmail=req.body.email;
    try{
        const users=await User.find({email:userEmail});
        if(users.length==0){
            res.status(404).send("User not found");
        }
        res.send(users);
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

connectDb().then(()=>{
    console.log("database connected successfully");
    app.listen(process.env.PORT,()=>{
    console.log("Server is successfully listening on port 3000...");
});
}).catch((err)=>{
    console.error("database connection failed");
})

