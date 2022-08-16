const express = require("express");
const app = express();
require("./db/conn");
app.use(express.json());
const User = require("../server/models/userSchema");
app.use(require("./router/auth"));
const port = process.env.port || 5000;


//routing
app.get("/", (req, res)=>{
    res.send("Home");
})

app.get("/about", middleware, (req, res)=>{
    console.log("Hello my middleware");
    res.send("About");
})

app.get("/contact", (req, res)=>{
    res.send("Contact");
})

app.get("/signin", (req, res)=>{
    res.send("Sign in");
})

app.get("/signup", (req, res)=>{
    res.send("Sign up");
})

app.listen(port, ()=>{
    console.log(`Connection Successful at ${port}`);
})