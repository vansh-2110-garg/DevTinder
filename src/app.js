const express = require('express');

const app = express();

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong");
    }
});

app.get("/user",(req,res,next)=>{
    throw new Error("ERRor");
    res.send("data");
});

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong");
    }
});


app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
});