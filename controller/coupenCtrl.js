const asyncHandler = require('express-async-handler')
const validateId = require("../utils/validateMongoDb.js")
const Coupen = require("../models/coupenModel.js");
const isValidDate = require('../utils/validateDate.js');

const createCoupen=asyncHandler(

    async(request,response)=>{

        try{
            const { expiry } = request.body;

            if (!expiry || !isValidDate(expiry)) {
                return response.status(400).json({ message: 'Invalid or missing expiration date.' });
            }
            const parsedExpiryDate = new Date(expiry);
            const newcoupen =await Coupen.create({...request.body,
                expiry:parsedExpiryDate
            }) 
            response.json(newcoupen)

        }catch(error){
            throw new Error(error)
        }
}

)

const getAllCoupen=asyncHandler(

    async(request,response)=>{

        try{
          
            const allcoupen =await Coupen.find({}) 
            response.json(allcoupen)

        }catch(error){
            throw new Error(error)
        }
}

)
const updateCoupen=asyncHandler(

    async(request,response)=>{

        try{
          const {id}=request.query
    
          validateId(id)
          
            const updatecoupen =await Coupen.findByIdAndUpdate(id,request.body,{new:true}) 
            response.json(updatecoupen)

        }catch(error){
            throw new Error(error)
        }
}

)

const deleteCoupen=asyncHandler(

    async(request,response)=>{

        try{
          const {id}=request.query
    
          validateId(id)
          
            const deletecoupen =await Coupen.findOneAndDelete(
                {
                _id:id
            },
        ) 
           return response.json(deletecoupen)

        }catch(error){
            throw new Error(error)
        }
}

)

module.exports={
    createCoupen,getAllCoupen,updateCoupen,deleteCoupen
}