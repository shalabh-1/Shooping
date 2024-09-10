
const mongoose=require("mongoose");
const asyncHandler = require('express-async-handler')
const validateId=
(id)=>{
   
    const isValid=mongoose.Types.ObjectId.isValid(id)

    if(!isValid){
        throw new Error("This is is not valid id or not found")
    }

}


module.exports=validateId