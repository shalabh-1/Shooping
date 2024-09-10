
const multer=require("multer")
const sharp=require("sharp")

const asyncHandler = require("express-async-handler")
const { multerstorage } = require("../config/productMulterconfig")
const { checkFileType } = require("../utils/multer")



  const multerfilter=function (req, file, cb) {
    checkFileType(file, cb)
  }


const uploadPhoto= multer({
  storage:multerstorage,
  fileFilter: multerfilter,
  limits:{fieldSize:2000000}
})

const blogImageReSize=asyncHandler(
async (request,response, next)=>{

    if(!request.files){
        next();
    }


    try{
      await Promise.all(request.files.map(async(file)=>{
      
        await sharp(file.path)
        .resize(300,300)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`/public/images/blogs/${file.filename}`)
    }
)
);
next()
    }catch(error){
     throw new Error(error)
    }

  

}
)
module.exports={uploadPhoto,blogImageReSize}