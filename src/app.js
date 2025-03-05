const express = require("express");
const app = express()
const connectDB = require("./config/database")
const User = require("./models/user")
const {validateSignupData} = require("./utils/validations");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth");
const bcrypt = require("bcrypt");

connectDB().then(() => {
    console.log("Database connection established")
    app.listen(3100, () => console.log("Server listening at the port 3100"));
}).catch(() => console.log("Error occured in DB connection"))

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user) {
            res.status(400).send('User not found')
        }
        console.log("helo")
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid) {
            const token = await user.createToken()
            res.cookie("token", token)
            res.status(200).send('Login Successfull!!!')
        } else
            throw new Error("Login unsuccessfull!!!")
    } catch(err) {
        res.status(400).send("Error adding user!"+err.message)
    }
})

app.get("/profile", async (req, res, next) => {
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

app.get("/user", userAuth, async (req, res) => {
   try {
    const user = await User.find({email: req.body.email})
    console.log("user", user, req.body.email)
     if(user) {
        res.status(200).send(user)
     } else {
        res.status(400).send("User not found")
     }
   } catch(err) {
        res.status(400).send("Error occured")
   }
})

app.get("/users", userAuth, async (req, res) => {
    try {
      const user = await User.find()
      if(user.length) {
         res.status(200).send(user)
      } else {
         res.status(400).send("Users not found")
      }
    } catch(err) {
         res.status(400).send("Error occured")
    }
 })

 app.get("/userByID", userAuth, async (req, res) => {
    try {
      const user = await User.find({_id: req.body.id})
      if(user) {
         res.status(200).send(user)
      } else {
         res.status(400).send("User not found")
      }
    } catch(err) {
         res.status(400).send("Error occured")
    }
 })

app.patch("/user/:userID", userAuth, async (req, res) => {
    try {
        const allowedFieldsUpdate = ["first_name", "age", "skills", "gender", "phone_number"]

        const isAllowed = Object.keys(req.body).every(val => allowedFieldsUpdate.includes(val))
        if(!Object.keys(req.body).length) {
            throw new Error("Nothing to update, send fields")
        }        
        if(!isAllowed) {
            throw new Error("Fields are not allowed")
        }
        const user = await User.findByIdAndUpdate({_id: req.params.userID}, req.body, {returnDocument: "after", runValidators: true},
        )
        console.log(user)
        if(user) {
            res.status(200).send("user updated successfully")
         } else {
            res.status(400).send("User not found")
         }
    } catch(err) {
        res.status(400).send("Error occured: "+err.message)

    }
})

app.put("/user", async (req, res) => {
    try {
        const user = await User.findOneAndReplace({_id: req.body.id}, req.body)
        console.log(user)
        if(user) {
            res.status(200).send("user replaced successfully")
         } else {
            res.status(400).send("User not found")
         }
    } catch(err) {
        res.status(400).send("Error occured")

    }
})

app.delete("/user/:userID", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({_id: req.params.userID})
        console.log(user)
        if(user) {
            res.status(200).send("user deleted successfully")
         } else {
            res.status(400).send("User not found")
         }
    } catch(err) {
        res.status(400).send("Error occured")
    }
})








// const {auth} = require("./middlewares/auth")
// app.use("/admin", auth)

// app.use("/admin/getAllData", (req, res) => {
//     res.status('200').send([{key: 22, value: 'two two'}, {key: 44, value: 'four four'}])
// })

// app.use("/admin/err", (err, req, res, next) => {
//     if(err) {
//         console.log("error occured");
//     }
//     try {
//         throw new Error("Error");
//     } catch(e) {
//         res.status("400").send('something went wrong')
//     }
// })

// app.get("/user", 
//     (req, res, next) => {
//         console.log("hello")
//         // res.send("1st data saved successfully")
//         next();
//     }, 
//     [(req, res, next) => {
//         console.log("1st")
//         // res.send("2nd response handled")
//         next();
//     }, 
//     (req, res, next) => {
//         console.log("2st")
//         // res.send("3nd response handled")
//         next();

//     }],
//     (req, res, next) => {
//         console.log("3st")
//         res.send("4nd response handled")
//         next();
//     })

// app.use('/', (req, res) => {
//     res.send("hello/route")
// })

// // app.use("/user",(req, res, next) => {res.send("next value")})
   
// app.use('/test', (req, res) => {})

// app.use("/test",(req, res) => {
//     res.send("default ");
// })


// app.use("/hello",(req, res) => {
//     res.send("hellogre default ");
// }) 

// app.use((req, res) => {res.send("cutie pie");});

// app.get("/", (req, res) => {
//     console.log("print")
//     res.send("hello printing")
// })


// app.get("/user(s*)/:name/:id", (req, res) => {
//     console.log("req", req.query, req.params);
//     res.send({firstName: "shobika", lastName: "saravanan"})
// })