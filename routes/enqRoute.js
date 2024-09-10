const express=require("express");
const { createEnquiry ,updateEnquiry,deleteEnquiry,getEnquiry,getAllEnquiry} = require("../controller/EnquiryCtrl");
const { authmiddleware, restrictToUser } = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",createEnquiry)
router.put("/:id",authmiddleware,restrictToUser(["admin"]),updateEnquiry)
router.delete("/:id",authmiddleware,restrictToUser(["admin"]),deleteEnquiry)
router.get("/:id",authmiddleware,restrictToUser(["admin"]),getEnquiry)
router.get("/",authmiddleware,restrictToUser(["admin"]),getAllEnquiry)

module.exports=router

