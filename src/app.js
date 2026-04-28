const express = require('express');

const app = express();

const {adminAuth , userAuth} = require("./middlewares/auth");

app.use("/admin",adminAuth);

app.get("/admin/getalldata",(req,res)=>{
    res.send("All data sent");
});

app.post("/user/login",(req,res)=>{
    res.send("login successful");
})

app.get("/user",userAuth,(req,res)=>{
    res.send("user data sent");
})


app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
});