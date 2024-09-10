const asyncHandler = require("express-async-handler");
const sharp=require("sharp")
const productImageReSize=asyncHandler(


    async (request,response, next)=>{
    
        if(!request.files){
            next();
        }
      
        try {
           
        await Promise.all(request.files.map(async(file)=>{
          file.resizePath=`public/images/product/resized-${file.filename}`
          await sharp(file.path)
          .resize(300,300)
          .toFormat('jpeg')
          .jpeg({quality:90})
          .toFile(`public/images/product/resized-${file.filename}`);
      
         }
      )
     )
      next()
        } 
        catch (error) {    
          throw new Error(error)
        }
       
      }
    )

    module.exports={productImageReSize}