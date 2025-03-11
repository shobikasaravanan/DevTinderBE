const express = require("express");
const profileRouter = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/user")
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData, validateEmailForPassword, validateNewPassword } = require("../utils/validations");

profileRouter.use(express.json())

profileRouter.get("/profile", userAuth, async (req, res, next) => {
    try {
        const {token} = req.cookies
        const decodedMessage = await jwt.verify(token, "DevTinder@777")
        const {_id } = decodedMessage
        if(!token) {
            throw new Error("User is not valid")
        } else {
            const user = await User.findOne({_id: _id})
            if(user) {
                res.status(200).send(user)
            } else {
                throw new Error("User not found")
            }
        }
    } catch(err) {
        res.status(400).send("Error ! "+err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res, next) => {
    try {
        const isAllowedEdit = validateProfileEditData(req)
        if(!isAllowedEdit) {
            throw new Error("Invalid input data")
        }
        const loggedInUser = req.user
        console.log("sss", req.user)

        Object.keys(req.body).forEach(field => loggedInUser[field] = req.body[field])
        await loggedInUser.save()
        res.send(`${loggedInUser.first_name}, your profile updated successfully`)
    } catch(err) {
        res.status(400).send({message: err.message})
    }
})

profileRouter.post("/profile/forgotPassword", async (req, res, next) => {
    try {
        if(!validateEmailForPassword(req)) {
            throw new Error("Please input valid email")
        }
        const user = await User.findOne({ email: req.body.email })
        if(user) {
            res.status(200).send("133231")
        } else {
            throw new Error("User not exist for this email Id")
        }
    }
    catch(err) {
        res.status(400).send(err.message)
    }
})

profileRouter.patch("/profile/Password", async (req, res, next) => {
    try {
        if(!validateNewPassword(req)) {
            throw new Error("Enter strong password or authentication code is incorrect")
        }
        const user = await User.findOne({ email: req.body.email })
        if(user) {
            user.password = req.body.password
            await user.save()
            res.status(200).send("New Password updated successfully")
        } else {
            throw new Error("User not found")
        }
    }
    catch(err) {
        res.status(400).send(err.message)
    }
})

module.exports = profileRouter