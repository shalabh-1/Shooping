const path=require("path")
function checkFileType(file, cb) {
   
    const filetypes = /jpg|jpeg|png/ // Choose Types you want...
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
  
    if (extname && mimetype) {
     cb(null, true)
    } else {
      cb('Images only!',false) // custom this message to fit your needs
    }
  }

  module.exports={checkFileType}