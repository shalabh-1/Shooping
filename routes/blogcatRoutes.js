const express=require("express");
const { createCategory ,updateCategory,deleteCategory,getCategory,getAllCategory} = require("../controller/blogCategoryCtrl");
const { authmiddleware, restrictToUser } = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authmiddleware,restrictToUser(["admin"]),createCategory)
router.put("/:id",authmiddleware,restrictToUser(["admin"]),updateCategory)
router.delete("/:id",authmiddleware,restrictToUser(["admin"]),deleteCategory)
router.get("/:id",authmiddleware,restrictToUser(["admin"]),getCategory)
router.get("/",authmiddleware,restrictToUser(["admin"]),getAllCategory)

module.exports=router

