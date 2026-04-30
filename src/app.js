const express = require('express');
const connectDb=require("./config/database");
const user = require("./models/user");
const app = express();

app.post("/signup",async(req,res)=>{
    const user= new User({
        firstName:"Vansh",
        lastName:"Garg",
        email:"vansh@garg.com",
        password:"vansh@123",
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
    app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
});
}).catch((err)=>{
    console.error("database connection failed");
})

