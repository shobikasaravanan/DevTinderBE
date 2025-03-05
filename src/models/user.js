const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    first_name: { 
        type: String,
        required: true,
        minLength: 3,
        maxLength: 12,
       
     },
    last_name: { type: String },
    password: { type: String },
    age: { type: Number },
    about: {type: String, default: "user about page"},
    gender: { 
        type: String,
        default: "Male", 
        validate(value) {
            if(!value.includes('male', 'female', 'others')) {
                return false
            }
        }
    },
    phone_number: { 
        type: String,
        required: true,
        validate(value) {
            if(!validator.isMobilePhone(value)) {
                throw new Error("Invalid phone number")
            }
        }
     },
    email: { 
        type: String,
        required: true,
        index:true,
            unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email Address")
            }
        }
    },
    skills: {
        type: Array,
        default: ['cricket'],
        validate(value) {
            if(value.length > 5) {
                throw new Error("only 5 skills are allowed")
            }
        }
    }
    

}, { timestamps: true })

userSchema.methods.validatePassword = async function(password) {
    console.log(password, "passwr")
    const user = this
    return await bcrypt.compare(password, user.password) 
}

userSchema.methods.createToken = async function() {
    const user = this
    const token = await jwt.sign({_id: user._id}, "DevTinder@777")
    return token
}


module.exports =  mongoose.model("User", userSchema)