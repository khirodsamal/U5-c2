const authorised=(permitedrole)=>{
    return (req,res,next)=>{
        const user_role=req.body.role
        if(permitedrole.includes(user_role)){
            next()
        }else{
            return res.status(400).send({"message":"unauthorized"})
        }
    }
}

module.exports={authorised}