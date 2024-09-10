const jsonwebtoken = require("jsonwebtoken")
const User = require("../models/userModel.js")
const asyncHandler = require("express-async-handler")
const { response } = require("express")
const { validateToken } = require("../config/jwtToken.js")

const authmiddleware = asyncHandler(

    (request, response, next) => {

        const headers = request?.headers["authorization"]
       
        if (headers && headers.startsWith("Bearer")) {
            const token = headers.split(" ")[1]

            try {
                const decode = validateToken(token); 
                request.user=decode
              
                next()
               
            } catch {
                throw new Error("You are unauthorized  please logged In again")
            }


        } else {
            throw new Error("Headers not found")
        }
           

    }

)

const restrictToUser=(arr=[])=>{

return asyncHandler( (request,response,next)=>{

    const user=request.user
    if(!user){
        throw new Error("please logged in")
    }
   
    if(!arr.includes(user.isAdmin)){
       
        throw new Error("You are unauthorized");

    }
    next();

}
)
}





module.exports={
    authmiddleware,restrictToUser   
}