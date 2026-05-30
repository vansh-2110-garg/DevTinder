const validator=require('validator');

const validateSignUpData=(req)=>{
    const {firstName,lastName,email,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("FirstName And LastName can not empty");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Invalid Email ID");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Not a strong password");
    }
}

const validateEditRequestData = (req)=>{
    const ALLOWED_EDITS = ["firstName" , "lastName" , "age" , "about","skills", "photoUrl","gender"];
    const isEditValid = Object.keys(req.body).every((field) => ALLOWED_EDITS.includes(field));
    return isEditValid;
}

module.exports={
    validateSignUpData,
    validateEditRequestData,
}