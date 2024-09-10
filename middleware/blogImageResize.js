const asyncHandler= require("express-async-handler");
const sharp = require("sharp");
const paths=require("path")
const blogImageReSize=asyncHandler(
    async (request,response, next)=>{
    
        if(!request.files){
            next();
        }
            
      
       
        try{
            let arr=request.files.map(async(file)=>{
                
                 const outputFilePath = paths.join(__dirname, '../public/images/blogs', `resized-${file.filename}`);                
                file.resizePath=outputFilePath
                await sharp(file.path)
                .resize(300,300)
                .toFormat('jpeg')
                .jpeg({quality:90})
                .toFile(outputFilePath)
            }
        )
          await Promise.all(arr);
    next()
        }catch(error){
         throw new Error(error)
        }
    
      
    
    }
    )

    module.exports={blogImageReSize}