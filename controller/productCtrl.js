const Product=require("../models/productModel.js")
const User=require("../models/userModel.js")
const asynHandler=require("express-async-handler")
const validateId = require("../utils/validateMongoDb.js")
const slugify = require('slugify')
const { validate } = require("../models/brandModel.js")
const {cloudinaryUploadImg,cloudinarydeleteImg}=require('../utils/cloudinary.js')
const fs = require('fs')


const createProduct=asynHandler(
    async (request,response)=>{
            if(request.body.title){
                request.body.slug=slugify(request.body.title,'-')
            }

           try {
           const product= await Product.create(request.body)
           response.json(product)
           } catch (error) {
            throw new Error(error)
           }
    }

)


const updateProduct=asynHandler(
        async (request,response)=>{
            const {id}=request.params
           

            try {
                validateId(id)
                if(request.body.title){
                request.body.slug=slugify(request.body.title) 
                }
                const product=await Product.findOneAndUpdate({_id:id},request.body,{new:true})  
                response.json({"message":"Update Successfully",
                    product
                })
            } catch (error) {
                throw new Error(error)
            }

        


        }


)

const deleteProduct=asynHandler(
    async (request,response)=>{
        const {id}=request.params
       

        try {
            validateId(id)
            if(request.body.title){
                request.body.slug=slugify(request.body.title) 
            }
            const product=await Product.findOneAndDelete({_id:id},{new:true})  
            response.json({message:"Delete Sucessfully",product})
        } catch (error) {
            throw new Error(error)
        }

    


    }


)

const getaProduct=asynHandler(
    async (request,response)=>{
            const {id}=request.params
           try {
            validateId(id)
           const product= await Product.findById(request.params.id)
           
           response.json(product)
           } catch (error) {
            throw new Error(error)
           }
    }
)

const getallProduct=asynHandler(
    async (request,response)=>{
           try {

        //   filtering
            const queryObj={...request.query};
            const excludeFields = ["page", "sort", "limit", "fields"];
            excludeFields.forEach(val=> delete  queryObj[val] )
            let queryStr=JSON.stringify(queryObj)
          
            // adding dollar sign
            queryStr=  queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
            queryObj2=JSON.parse(queryStr)
           
             let query=  Product.find(queryObj2)
            // sorting
           
            if(request?.query?.sort){
                // console.log(request.query.sort.split(","))
                const sortBy=request.query.sort.split(",").join(" ")
                
                // sortBy=catgory,brand
                query = query.sort(sortBy);
            }else{
                query = query.sort("-createdAt")
            }

            // limiting the fiedds
            if(request?.query?.fields){
                const fields=request.query.fields.split(",").join(" ")
                // console.log(fields)
                query=query.select(fields)
            }else{
                // minus means de dont need this field in output
                query=query.select("-__v")
            }

            // pagination
                const page=parseInt(request.query?.page)
                const limit=parseInt(request.query?.limit)
                const  skip=(page-1)*limit

               
                query=query.limit(limit).skip(skip)
                if(request?.query?.page && request?.query?.limit){
                    const productCount=await Product.countDocuments();
                    if(skip>=productCount){
                     throw new Error("This page does not exist")   
                    }
                }


            const product=await query
            response.json(product)
           } catch (error) {
            throw new Error(error)
           }
    }
)


const rating=asynHandler(

    async (request,response)=>{

      
      try{
      const {id}=request.user
      const {star,productid,comment}=request.body

      validateId(productid)
      let product=await Product.findById(productid)
     
      const alreadyRating=product.rating.find(({ postedBy})=>( postedBy.toString()===id.toString()))
        console.log(alreadyRating)
      if(alreadyRating){
       
         await Product.updateOne(
            {
              _id: productid, // Match the product by its ID
              "rating.postedBy": id // Match the specific rating by the user
            },
            {
              $set: { 
                 "rating.$.star": star,
                 "rating.$.comment": comment 
              
                } // Use $set to update the correct field
            },
            {
                new:true
            }
            

)


      }else{

        product.rating.push({
          star:star,
          postedBy:id,
          comment:comment
        })
        await product.save()
      }
         let gettAllRating=await Product.findById(productid)
        
         const len=gettAllRating.rating.length
        const totalrating=gettAllRating.rating.map((obj)=>obj.star).reduce((val1,val2)=>val1+val2)
           
        gettAllRating.totalrating=Math.round(totalrating/len)
       
        console.log(gettAllRating.totalrating)
        gettAllRating= await gettAllRating.save()
        
        response.json(gettAllRating)
      }
      catch(error){
      throw new Error(error)
    }


    }

)


const uploadImage=asynHandler(


    async(request,response)=>{

      // const {id}=request.params

      try{

      
        const uploader = (path) => cloudinaryUploadImg(path, "product");

        const files=request.files

        console.log(files)
      
        const urls = await Promise.all(files.map(async (file) => {
          const { path,resizePath} = file;
          fs.unlink(path, (err) => {
            if (err) {
              console.error('Error deleting the file:', err);
              return;
            }
            console.log('File deleted successfully!');
          });
          return uploader(resizePath);
      }));

      response.json(urls)
     

        // const findproduct=await Product.findByIdAndUpdate(id,{
        //   images:urls

        // },{
        //   new:true
        // })
        // response.json(findproduct)
        
      }catch(error){
      throw new Error(error)
  }

}


)


const deleteImages=asynHandler(


    async(request,response)=>{

      const {id}=request.params

      console.log(id)
          try{
            
      
       const obj= await cloudinarydeleteImg(id);

        response.json({"message":obj.message})
 
        
      }catch(error){
      throw new Error(error)
  }

}


)

module.exports={
    createProduct,
    getaProduct,
    getallProduct,
    updateProduct,
    deleteProduct,
    asynHandler,
    rating,
    uploadImage,
    deleteImages
  }