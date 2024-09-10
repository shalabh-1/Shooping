const asyncHandler = require('express-async-handler')
const validateId = require("../utils/validateMongoDb.js")
const Category = require("../models/prodcategoryModel.js")
const Blog = require("../models/blogModel.js")
const { response } = require('express')


const createCategory=asyncHandler(


   async (request ,response)=>{
    console.log("check")
        try{

            let category=new Category(request.body)

            category=  await category.save()


            response.json(category)



        }catch(error){

            throw new Error(error) 
        }
    }



)


const updateCategory=asyncHandler(


    async (request ,response)=>{
   
         try{
            const {id}=request.params
 
            let category=  await Category.findByIdAndUpdate(id,request.body,
                {
                    new:true
                }
            )
             response.json(category)
 
         }catch(error){
 
             throw new Error(error) 
         }
     }
 
 
 
 )

 
const deleteCategory=asyncHandler(


    async (request ,response)=>{
   
         try{
            const {id}=request.params
 
            let category=  await Category.findByIdAndDelete(id)
               
             response.json(category)
 
         }catch(error){
 
             throw new Error(error) 
         }
     }
 
 
 
 )


 
const getCategory=asyncHandler(


    async (request ,response)=>{
   
         try{
            const {id}=request.params
 
            let category=  await Category.findById(id)
               
             response.json(category)
 
         }catch(error){
 
             throw new Error(error) 
         }
     }
 
 
 
 )


 
 
const getAllCategory=asyncHandler(


    async (request ,response)=>{
   
         try{
           
 
            let category=  await Category.find({})
               
             response.json(category)
 
         }catch(error){
 
             throw new Error(error) 
         }
     }
 
 
 
 )
module.exports={createCategory,updateCategory,deleteCategory,getCategory,getAllCategory}