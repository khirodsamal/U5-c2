const jwt =require("jsonwebtoken");
const {blacklistModel}=require("../model/blacklostedmodel");
const {userModel}=require("../model/userModel");
require("dotenv").config()

const authenticate=async(req,res,next)=>{
    const token=req.headers.authorization
    // console.log("token",token)
    try {
        if(token){
            const tokenblacklist=await blacklistModel.findOne({accessToken:token})
            console.log("token",tokenblacklist)
            if(tokenblacklist){
                return res.status(401).send({"message":"please login first"})
            }
            const decoded=jwt.verify(token,process.env.tokenKey)
            if(decoded){
                req.body.role=decoded.role
                req.body.email=decoded.email
                console.log(req.body.email)
                next()
            }else{
                return res.status(400).send({"message":"please login first"})
            }

        }else{
            return res.status(400).send({"message":"please login first"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({"message":"something weent wrong on authenticate"})
    }
}

module.exports={authenticate}