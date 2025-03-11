const validator = require("validator")
const validateSignupData = (req) => {
    const { first_name, last_name, password, email} = req.body

    if(!first_name || !last_name) {
        throw new Error("Name is not valid")
    }

    if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not valid")
    }

    if(!validator.isEmail(email)) {
        throw new Error("Email is not valid")
    }
}

const validateProfileEditData = (req) => {
    const allowedEditData = ["first_name", "last_name", "age", "about", "gender", "phone_number", "skills", "password"]
    const isAllowedEdit = Object.keys(req.body).every(fields => allowedEditData.includes(fields)) 
    return isAllowedEdit;
}

const validateEmailForPassword = (req) => {
    return validator.isEmail(req.body.email)
}

const validateNewPassword = (req) => {
    if(req.body.code !== "133231") {
        return false
    }
    const isValidPassword = validator.isStrongPassword(req.body.password)
    return isValidPassword
}

module.exports = { validateSignupData, validateProfileEditData, validateEmailForPassword, validateNewPassword }