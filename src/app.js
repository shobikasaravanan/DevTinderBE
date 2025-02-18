const express = require("express");
const app = express()
app.listen(3100, () => {console.log("Server listening at the port 3100");});

app.use("/test",(req, res) => {
    res.send("default ");
})

app.use("/hello",(req, res) => {
    res.send("hellogre default ");
}) 
app.use("", (req, res) => {res.send("cutie pie");});
// app.get("/", (req, res) => {
//     console.log("print")
//     res.send("hello printing")
// })
