const express = require('express');
const {userAuth}=require('../middlewares/auth');
const {validateEditRequestData} = require('../utils/validation');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validateEditRequestData(req)){
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();
        res.json({
            status:"Successful",
            message:`${loggedInUser.firstName}, Your profile Updated Successfully`,
            data: loggedInUser
        });
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
})

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
    try{
        const {oldPassword,newPassword} = req.body;
        if(!oldPassword || !newPassword) {
            throw new Error("Please enter both old and new passwords");
        }

        const user = req.user;
        const isPasswordValid = await user.validatePassword(oldPassword);
        if(!isPasswordValid){
            throw new Error("Current Password Does Not Match");
        }

        const isStrongPassword = validator.isStrongPassword(newPassword);
        if(!isStrongPassword){
            throw new Error("Enter a strong new password");
        }

        const isSamePassword = await user.validatePassword(newPassword);
        if(isSamePassword){
            throw new Error("New Password can not be same as old password");
        }
        
        const newPasswordHash = await bcrypt.hash(newPassword,10);
        user.password = newPasswordHash;
        await user.save();
        res.send("Password Updated Successfully");
    }
    catch(err){
        res.status(400).send("ERROR:" + err.message );
    }

})

module.exports = profileRouter;