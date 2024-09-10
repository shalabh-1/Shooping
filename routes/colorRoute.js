const express=require("express");
const { createColor ,updateColor,deleteColor,getColor,getAllColor} = require("../controller/colorCtrl");
const { authmiddleware, restrictToUser } = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authmiddleware,restrictToUser(["admin"]),createColor)
router.put("/:id",authmiddleware,restrictToUser(["admin"]),updateColor)
router.delete("/:id",authmiddleware,restrictToUser(["admin"]),deleteColor)
router.get("/:id",authmiddleware,restrictToUser(["admin"]),getColor)
router.get("/",authmiddleware,restrictToUser(["admin"]),getAllColor)

module.exports=router

