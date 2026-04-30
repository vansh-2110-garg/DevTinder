const mongoose = require('mongoose');

const connectDb=async ()=>{
    await mongoose.connect("mongodb+srv://Vansh_mongoDB:uY6U0VD80B07LFWW@vanshdev.obziue3.mongodb.net/devTinder")
}

module.exports=connectDb;
