const express = require('express');

const app = express();


app.get("/user",
    (req,res,next)=>{
        console.log("1");
        res.send("1");
        next();
    },
    (req,res,next)=>{
        console.log("2");
        // res.send("2");
        next();
    },
    (req,res,next)=>{
        console.log("3");
        // res.send("3");
        next();
    },
    (req,res,next)=>{
        console.log("4");
        // res.send("4");
        next();
    },
    (req,res,next)=>{
        console.log("5");
        // res.send("5");
        next();
    }
)


app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
});