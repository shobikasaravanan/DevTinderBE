const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    gender: { type: String },
    phone_number: { type: String },
    email: { type: String },
})

module.exports =  mongoose.model("User", userSchema)