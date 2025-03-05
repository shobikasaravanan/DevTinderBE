const express = require("express");
const app = express()

const connectDB = require("./config/database")
const User = require("./models/user")

connectDB().then(() => {
    console.log("Database connection established")
    app.listen(3100, () => console.log("Server listening at the port 3100"));
}).catch(() => console.log("Error occured in DB connection"))

app.use(express.json())
app.post("/signup", async (req, res) => {
    // const userObj = new User({
    //     first_name: "ms",
    //     last_name: "dhoni",
    //     age: 46,
    //     gender: 'male',
    //     phone_number: '9284844933',
    //     email: "msdhoni@gmail.com"
    // })
    // console.log("req.body", req.body)
    const userObj = new User(req.body)
    try {
        await userObj.save()
        res.status(201).send("User added successfully!")
    } catch(err) {
        res.status(400).send("Error adding user!")
    }
})

app.get("/user", async (req, res) => {
   const user = await User.find({email: req.body.email})
   console.log("user", user, req.body.email)
   try {
     if(user) {
        res.status(200).send(user)
     } else {
        res.status(400).send("User not found")
     }
   } catch(err) {
        res.status(400).send("Error occured")
   }
})

app.get("/users", async (req, res) => {
    const user = await User.find()
    try {
      if(user.length) {
         res.status(200).send(user)
      } else {
         res.status(400).send("Users not found")
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