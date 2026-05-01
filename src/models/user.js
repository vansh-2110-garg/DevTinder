const mongoose = require('mongoose');

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
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
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
        default:"data:image/jpeg;base64,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"
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