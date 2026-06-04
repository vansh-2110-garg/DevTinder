const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName photoUrl age gender about skills";

//Get all the pending connection request received by logged in user
userRouter.get('/user/requests/received',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId", SAFE_USER_DATA);

        if(!connectionRequests){
            return res.status(404).json({
                status : "Failed",
                message : "No pending requests"
            })
        }

        res.json({
            status : "Success",
            message : "Data fetched successfully",
            connectionRequests
        })
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        let connections = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id , status : "accepted"},
                {fromUserId : loggedInUser._id , status : "accepted"},
            ]
        })
        .populate("fromUserId",SAFE_USER_DATA)
        .populate("toUserId",SAFE_USER_DATA);
        
        connections = connections.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId; 
        })

        res.json({
            status : "Success",
            message : "Connections Fetched Successfully",
            connections
        })

    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = Math.min(limit,50);
        const skip = (page-1)*limit;


        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        })
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const feed = await User.find({
            $and : [
                {_id : {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(SAFE_USER_DATA).skip(skip).limit(limit);

        res.json({
            status : "Success",
            message : "Feed fetched successfully",
            feed
        });
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;