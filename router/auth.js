const express = require("express");
const { exists } = require("../models/userSchema");
const router = express.Router();
require("../db/conn");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

router.get("/", (req, res) => {
    res.send("Hello Boy")
})

//register route
router.post("/register", async (req, res) => {

    //checking if all field is filled properly
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill the field properly" })
    }

    //checking if email is already registered or not 
    try {
        const userExist = await User.findOne({ email: email })
        if (userExist) {
            return res.status(422).json({ error: "Email already exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Password do not match" });
        } else {
            //fetching data and pushing into database
            const user = new User({ name, email, phone, work, password, cpassword });
            //bcryptjs
            const userRegister = await user.save();
            if (userRegister) {
                res.status(201).json({ message: "User registered successfully" })
            } else {
                res.status(500).json({ error: "Failed to register" });
            }
        }

    } catch (err) {
        console.log(err);
    }

})

//login route
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" });
        }

        //comparing email matches or not
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            //comparing password matches or not
            const isMatch = await bcrypt.compare(password, userLogin.password);
            //getting a token
            const token = await userLogin.generateAuthToken();
            //store jwt in cookie
            res.cookie("jwtoken", token,{
                expires: new Date(Date.now() + 2419200),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credentials" });
            } else {
                res.status(200).json({ message: "User signin successful" });
            }
        } else {
            res.status(400).json({ error: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
})

//middleware
router.get("/about", authenticate, (req, res)=>{
    console.log("Hello my middleware");
    res.send(req.rootUser);
})

router.get("/getdata",authenticate,(req,res)=>{
    console.log("Hello my middleware");
    res.send(req.rootUser);
})


router.post("/contact",authenticate,async(req,res)=>{
    try{
        const{name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            return res.json({error: "Please fill the data"});
        }
        const userContact = await User.findOne({_id:req.userID});
        if(userContact)
        {
            const userMessage = await userContact.addMessage(name, email, phone , message);
            await userContact.save();
            res.status(201).json({message:"User contact sent successfully"});
        }
    }catch(err)
    {
        console.log(err);
    }
})


router.get("/logout",(req, res)=>{
    console.log("Hello my logout page");
    res.clearCookie('jwtoken', {path: "/"});
    res.status(200).send("User logout");
})

module.exports = router;


