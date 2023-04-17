const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const {userModel}=require("../model/userModel");
require("dotenv").config()
const {authenticate}=require("../middleware/authenticate")
const cookieparser=require("cookie-parser")
router.use(cookieparser())


// ************ register section************************

router.post("/signup",async(req,res)=>{
    try {
        const {name,email,password,role}=req.body
        if(!email){
            return res.status(400).send({"message":"email is required"})
        }
        if(!password){
            return res.status(400).send({"message":"password is required"})
        }
       
        const userExist= await userModel.findOne({email})
        if(userExist){
            return res.status(400).send({"message":"email is already exist please signup"})
        }
        bcrypt.hash(password,7,async(error,hash)=>{
            if(error){
                console.log("bcrypt",error)
                return res.status(500).send({"message":"something went wrong"})  
            }
            const user= new userModel({name,email,password:hash,role})
             await user.save()
             res.status(200).send({"message":"register seccessfully"})
        })  
    } catch (error) {
        console.log(error)
        res.status(500).send({"message":"something went wrong "})
    }
})

// ********************* login *************************
router.post("/login",async(req,res)=>{
    const {email,password}=req.body
    console.log(email,password)
    try {
        if(!email){
            return res.status(400).send({"message":"put email"})
        }
        if(!password){
            return res.status(400).send({"message":"put password"})
        }
        const user=await userModel.findOne({email})
        console.log(user)
        if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
               if(result){
                const accesstoken=jwt.sign({email,role:user.role},process.env.tokenKey,{expiresIn:"3m"})
                const refreshtoken=jwt.sign({email,role:user.role},process.env.retokenkey,{expiresIn:"3m"})
                res.cookie("accessToken",accesstoken,{maxAge:7*24*60*60*1000})
                res.cookie("refreshToken",refreshtoken,{maxAge:7*24*60*60*1000})
                res.status(200).send({"message":"login syccessfull","token":accesstoken})
               }else{
                return res.status(400).send({"message":"wrong password"})
               } 
            })
        }else{
            return res.status(400).send({"message":"put correct email id"})
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({"message":"something went wrong"})
    }
})


// ************ refreshtoken ************
router.get("/refreshtoken",async(req,res)=>{
    const refreshtoken = req.cookies.refreshToken;
    try {
        const isblacklist= await blacklistModel.findOne({ refreshToken:refreshtoken})
        if(isblacklist) return res.status(400).send({msg:"Please login"})
        if(refreshtoken){
            const isvalid=jwt.verify(refreshtoken,process.env.retokenkey)
            console.log(isvalid)
            if(isvalid){
            const newaccesstoken=jwt.sign({email:isvalid.email,role:isvalid.role},process.env.tokenKey,{expiresIn:"3m"})
            res.cookie("accessToken",newaccesstoken,{maxAge:7*24*60*60*1000})
                res.send(newaccesstoken)
            }
        }else{
            res.status(400).send({"message":"please login"})
        }
    } catch (error) {
        console.log(error)
        return res.send({"message":error.message})
    }
   
})

// ****************logout***************

const {blacklistModel}=require("../model/blacklostedmodel")
router.get("/logout",authenticate,async(req,res)=>{
    const {accessToken,refreshToken}=req.cookies
    console.log(accessToken,refreshToken)
    const Baccesstoken= new blacklistModel({accessToken})
    await Baccesstoken.save()
    const Brefreshtoken= new blacklistModel({refreshToken})
    await Brefreshtoken.save()
    res.status(200).send({"message":"logout successfull"})
})



module.exports={router}