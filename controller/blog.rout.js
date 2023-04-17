const express=require("express")
const brout=express.Router()
const {authenticate}=require("../middleware/authenticate")
const {authorised}=require("../middleware/authorised")
const {blogModel}=require("../model/blogmodel")

brout.post("/create",authenticate,authorised(["user"]),async(req,res)=>{
    const {title,subject,topic}=req.body

    try {
        if({title,subject,topic}){
            const blog=new blogModel({title,subject,topic,email:req.body.email})
            await blog.save()
            res.status(200).send({"message":"blog created successfull"})
        }else{
            res.status(400).send({"message":"create a blog"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({"message":"something went wrong in server"})
    }
})

// *******************get blogs***************************
brout.get("/myblog",authenticate,authorised(["user"]),async(req,res)=>{
    try {
        const email=req.body.email
    const blogs=await blogModel.find({email})
    res.status(200).send(blogs)
    } catch (error) {
        console.log(error)
        res.status(500).send({"message":"something went wrong"})
    }
    
})


module.exports={brout}