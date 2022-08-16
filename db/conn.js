const mongoose = require("mongoose");

//connecting database to backend
mongoose.connect("mongodb://localhost:27017/deepakmern",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection Successful");
}).catch((error)=>{
    console.log(error);
})