const multer=require("multer")
const path=require("path")
const multerstorage = multer.diskStorage({
    destination(req, file, cb) {
  
      cb(null, path.join(__dirname,'../public/images/blogs'))
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`
      )
    },
  })

  module.exports={multerstorage}