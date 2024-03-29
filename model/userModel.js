const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        require:true,
        default:"user",
        enum:["user","moderator"]
    }
},{
    versionKey:false
});

const userModel=mongoose.model("user",userSchema)
module.exports={userModel}