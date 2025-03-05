const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://devchamp777:olPIkqEEAD0BCZUh@nodelearning.z3lhw.mongodb.net/DevTinder")
}

module.exports = connectDB