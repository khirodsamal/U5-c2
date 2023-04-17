const mongoose=require("mongoose");

const blogSchema=mongoose.Schema({
    title:String,
    subject:String,
    topic:String,
    email:String
},
{
    versoinKey:false
})

const blogModel=mongoose.model("blog",blogSchema)
module.exports={blogModel}
