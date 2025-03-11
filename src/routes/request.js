const express = require("express");
const connectionRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");

connectionRouter.post("/request/send/:status/:userId", userAuth, async (req, res,next) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status
        const allowedStatus =  ['interested', 'ignored']

        if(!allowedStatus.includes(status)) {
            throw new Error("Status is not valid")
        }

        const user = await User.findOne({_id: toUserId})
        if(!user) {
            throw new Error("Connection cannot be sent, User not present")
        }

        const isExisitingConnections = await ConnectionRequest.findOne({
            $or: [
                    {fromUserId, toUserId},
                    {fromUserId: toUserId, toUserId: fromUserId}, 
                ]
        })
        if(isExisitingConnections) {
            throw new Error("Connection already exists")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        const data = await connectionRequest.save()

        res.json({
            message: `{message: ${req.user.first_name} connection request sent successfully}`,
            data
        })

    } catch(err) {
        res.status(400).send(err.message)
    }
})

connectionRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const {status, requestId} = req.params
        const loggedInUser = req.user

        const allowedStatus = ["accepted", "rejected"]
        
        if(!allowedStatus.includes(status)) {
            throw new Error("Invalid status")
        }

        const user = await User.findOne({_id: requestId})
        if(!user) {
            throw new Error("User not found")
        }

        if(loggedInUser._id === requestId) {
            throw new Error("Sent user is not valid")
        }

        const connectionRequest = await ConnectionRequest.findOne({ 
            status: "interested", fromUserId: requestId, toUserId: loggedInUser._id,
        })

        if(!connectionRequest) {
            throw new Error("Connection request not found")
        }

        connectionRequest.status = status

        const data = await connectionRequest.save()

        res.json({message: `${loggedInUser.first_name} ${status} the sent request of ${requestId}`, data})


    } catch(err) {
        res.status(400).send(err.message)
    }
})

module.exports = connectionRouter;