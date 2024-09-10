
const multer=require("multer")
const sharp=require("sharp")

const { multerstorage } = require("../config/blogMulterconfig")
const { checkFileType } = require("../utils/multer")



  const multerfilter=function (req, file, cb) {
    checkFileType(file, cb)
  }


const uploadPhoto= multer({
  storage:multerstorage,
  fileFilter: multerfilter,
  limits:{fieldSize:2000000}
})


module.exports={uploadPhoto}