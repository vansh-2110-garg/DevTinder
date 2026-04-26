const express = require('express');

const app = express();

app.get("/user/:userID/:name/:password",(req,res)=>{
    console.log(req.params);
    res.send({firstName:"Vansh",lastName:"Garg"});
});


app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
});