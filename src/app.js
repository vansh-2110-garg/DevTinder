const express = require('express');
const connectDb=require("./config/database");
const User = require("./models/user");
const app = express();
require("dotenv").config();

app.post("/signup",async(req,res)=>{
    const user= new User({
        firstName:"Vansh",
        lastName:"Garg",
        email:"Vansh@garg.com",
        password:"Vansh@123",
    });

    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err){
        res.status(400).send("Error Saving the user" + err.message);
    }
});

connectDb().then(()=>{
    console.log("database connected successfully");
    app.listen(process.env.PORT,()=>{
    console.log("Server is successfully listening on port 3000...");
});
}).catch((err)=>{
    console.error("database connection failed");
})

