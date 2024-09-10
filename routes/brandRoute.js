const express=require("express");
const { createBrand ,updateBrand,deleteBrand,getBrand,getAllBrand} = require("../controller/brandCtrl");
const { authmiddleware, restrictToUser } = require("../middleware/authMiddleware");
const router=express.Router();

router.post("/",authmiddleware,restrictToUser(["admin"]),createBrand)
router.put("/:id",authmiddleware,restrictToUser(["admin"]),updateBrand)
router.delete("/:id",authmiddleware,restrictToUser(["admin"]),deleteBrand)
router.get("/:id",authmiddleware,restrictToUser(["admin"]),getBrand)
router.get("/",authmiddleware,restrictToUser(["admin"]),getAllBrand)

module.exports=router

