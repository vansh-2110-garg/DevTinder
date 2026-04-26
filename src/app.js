const express = require('express');

const app = express();

app.get("/user",(req,res)=>{
    res.send({firstName:"Vansh",lastName:"Garg"});
});
app.post("/user",(req,res)=>{
    console.log("save the data to the database");
    res.send("Data successfully saved to database");
});
app.delete("/user",(req,res)=>{
    res.send("Data deleted successfully");
});
app.use("/test",(req,res)=>{
    res.send("Hello From the server!");
});

app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000...");
});