const express=require("express");
const { createProduct,getaProduct,getallProduct,updateProduct,deleteProduct ,rating,uploadImage, deleteImages} = require("../controller/productCtrl");
const { authmiddleware ,restrictToUser} = require("../middleware/authMiddleware");
const {uploadPhoto}=require("../middleware/productUploadimages");
const { productImageReSize } = require("../middleware/productImageResize");


const router=express.Router();
router.put("/ratings",authmiddleware,rating)
router.post("/",authmiddleware,restrictToUser(["admin"]) ,createProduct)
router.get("/:id",getaProduct)
router.put("/upload",authmiddleware,restrictToUser(["admin"])
,uploadPhoto.array("images",10)
,productImageReSize,uploadImage
)
router.get("/",getallProduct)
router.put("/:id",authmiddleware,restrictToUser(["admin"]),updateProduct)
router.delete('/:id',authmiddleware,restrictToUser(["admin"]),deleteProduct)

router.delete('/delete-img/:id',authmiddleware,restrictToUser(["admin"]),deleteImages)

module.exports=router;

