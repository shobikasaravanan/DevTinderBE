const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuth = async (req, res, next) => {
    try {
            const { token } = req.cookies
            if(!token) {
                throw new Error("User token is not valid")
            } else {
                const decodedMessage = await jwt.verify(token, "DevTinder@777")
                const { _id } = decodedMessage
                const user = await User.findOne({_id: _id})
                if(user) {
                    req.user = user
                    next()
                } else {
                throw new Error("Unauthorised")
                }
            }
        } catch(err) {
            res.status(401).send("Error ! "+ err.message)
        }
}  

module.exports= {
    userAuth
}