const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        toUserId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            index : true,
            required : true
        },
        fromUserId:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User", 
            required : true
        },
        status:{
            type : String,
            required : true,
            enum:{
                values : ["accepted","rejected","interested","ignored"],
                message : `{value} is not valid status`
            }
        },
    },
    {timeStamps : true}
);

connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

connectionRequestSchema.pre("save", function(){
    //Check if toUserId is same as fromUserId
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
});

const connectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = connectionRequestModel;