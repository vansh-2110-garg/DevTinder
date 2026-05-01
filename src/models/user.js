const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true,
        maxlength:50,
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email"+value);
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password"+value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        trim:true,
        lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-z61lEOyxwEIqk7FRphKxA7-Vqmkbtid-SYPOeZf5yg&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL"+value);
            }
        },
    },
    about:{
        type:String,
        default:"Hey there! I am using DevTinder."
    },
    skills:{
        type: [String],
    }
},{
    timestamps:true
})

module.exports= mongoose.model("User",userSchema);