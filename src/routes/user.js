const express = require("express");
const userRouter = express.Router();
const User = require("../models/user")
const { userAuth } = require("../middlewares/auth");
const { Connection } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");

// pending connection requests from logged in user
userRouter.get("/user/requests", userAuth, async (req,res) => {
    try {
        const connectionRequests = await ConnectionRequest.find({
            status: "interested", toUserId: req.user._id
        }).populate("fromUserId", "first_name last_name")

        if(!connectionRequests) {
            throw new Error("No connection requests found");
        }
        res.status(200).send(connectionRequests)
    } catch(err) {
        res.status(400).send(err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id

        const connectionRequests = await ConnectionRequest.find({
             $or: [{toUserId: loggedInUser, status: "accepted"}, {fromUserId: loggedInUser, status: "accepted"}]})
            .populate("fromUserId", "first_name last_name")
            .populate("toUserId", "first_name last_name")
        

        if(!connectionRequests) {
            throw new Error("No connection requests found");
        }

        const data = connectionRequests.map(row => {
            if(row.fromUserId._id.toString() === loggedInUser.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.status(200).send(data)

    } catch(err) {
        res.status(400).send(err.message)
    }
})

userRouter.get("/user/feeds", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = (page - 1) * limit 


        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId")

        const hideUserFeeds = new Set()

        connectionRequests.forEach((row) => {
            hideUserFeeds.add(row.fromUserId.toString())
            hideUserFeeds.add(row.toUserId.toString())
        }) 

        if(!connectionRequests) {
            throw new Error("No users in feed")
        }

        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUserFeeds) }},
                {_id: { $ne: loggedInUser._id}} ]
        }).select("first_name")
        .skip(skip).limit(limit)

        res.status(200).send(users)

    } catch(err) {
        res.status(400).send(err.message)
    }
})


// userRouter.get("/user", userAuth, async (req, res) => {
//     try {
//         const user = await User.find({ email: req.body.email })
//         console.log("user", user, req.body.email)
//         if (user) {
//             res.status(200).send(user)
//         } else {
//             res.status(400).send("User not found")
//         }
//     } catch (err) {
//         res.status(400).send("Error occured")
//     }
// })

// userRouter.get("/users", userAuth, async (req, res) => {
//     try {
//         const user = await User.find()
//         if (user.length) {
//             res.status(200).send(user)
//         } else {
//             res.status(400).send("Users not found")
//         }
//     } catch (err) {
//         res.status(400).send("Error occured")
//     }
// })

// userRouter.get("/userByID", userAuth, async (req, res) => {
//     try {
//         const user = await User.find({ _id: req.body.id })
//         if (user) {
//             res.status(200).send(user)
//         } else {
//             res.status(400).send("User not found")
//         }
//     } catch (err) {
//         res.status(400).send("Error occured")
//     }
// })

// userRouter.patch("/user/:userID", userAuth, async (req, res) => {
//     try {
//         const allowedFieldsUpdate = ["first_name", "age", "skills", "gender", "phone_number"]

//         const isAllowed = Object.keys(req.body).every(val => allowedFieldsUpdate.includes(val))
//         if (!Object.keys(req.body).length) {
//             throw new Error("Nothing to update, send fields")
//         }
//         if (!isAllowed) {
//             throw new Error("Fields are not allowed")
//         }
//         const user = await User.findByIdAndUpdate({ _id: req.params.userID }, req.body, { returnDocument: "after", runValidators: true },
//         )
//         console.log(user)
//         if (user) {
//             res.status(200).send("user updated successfully")
//         } else {
//             res.status(400).send("User not found")
//         }
//     } catch (err) {
//         res.status(400).send("Error occured: " + err.message)

//     }
// })

// userRouter.put("/user", userAuth, async (req, res) => {
//     try {
//         const user = await User.findOneAndReplace({ _id: req.body.id }, req.body)
//         console.log(user)
//         if (user) {
//             res.status(200).send("user replaced successfully")
//         } else {
//             res.status(400).send("User not found")
//         }
//     } catch (err) {
//         res.status(400).send("Error occured")

//     }
// })

// userRouter.delete("/user/:userID", userAuth, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete({ _id: req.params.userID })
//         console.log(user)
//         if (user) {
//             res.status(200).send("user deleted successfully")
//         } else {
//             res.status(400).send("User not found")
//         }
//     } catch (err) {
//         res.status(400).send("Error occured")
//     }
// })

module.exports = userRouter