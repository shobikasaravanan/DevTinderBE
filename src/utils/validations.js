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

module.exports = {validateSignupData}