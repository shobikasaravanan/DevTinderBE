const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user")
const { validateSignupData } = require("../utils/validations");


authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req)
        const {first_name, last_name, password, email, gender, phone_number, skills, about, age} = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const userObj = new User({first_name, last_name, password: passwordHash, email, gender, phone_number, skills, about, age})
        await userObj.save()
        res.status(201).send("User added successfully!")
    } catch(err) {
        res.status(400).send("Error adding user!"+err.message)
    }
})

authRouter.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user) {
            res.status(400).send('User not found')
        }

        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid) {
            const token = await user.createToken()
            res.cookie("token", token)
            res.status(200).send('Login Successfull!!!')
        } else
            throw new Error("Login unsuccessfull!!!")
    } catch(err) {
        res.status(400).send("Error adding user! "+err.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })
        res.status(201).send("User logged out!")
    } catch(err) {
        res.status(400).send("Error logging out user!"+err.message)
    }
})

module.exports = authRouter