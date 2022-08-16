const jwt = require("jsonwebtoken");
const User = require("../server/models/userSchema");

const authenticate = (req, res, next) =>
{
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, "MYNAMEISDEEPAKPODDARANDIAMASTUDENT456");
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token})
        if(!rootUser)
        {
            throw new Error("User not found");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
    }catch(err)
    {
        res.status(401).send("Unauthorized: No Token Provided");
        console.log(err);
    }
}

module.exports = authenticate;