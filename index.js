const express=require("express")
const app=express()
app.use(express.json())
const {connect}=require("./database/db")
const {authenticate}=require("./middleware/authenticate")



app.get("/",authenticate,(req,res)=>{
    res.send("wellcome...")
})

const {router}=require("./controller/user.rout")
app.use("/user",router)

const {brout}=require("./controller/blog.rout")
app.use("/blog",brout)


app.listen(process.env.port,async()=>{
    try {
        await connect 
        console.log("connect to db")
    } catch (error) {
        
    }
    console.log(`server is running at 8800 ${process.env.port}`)
})