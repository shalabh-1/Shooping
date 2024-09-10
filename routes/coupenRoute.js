const express=require("express");
const router=express.Router();
const { authmiddleware, restrictToUser } = require("../middleware/authMiddleware.js");

const {createCoupen,getAllCoupen,updateCoupen,deleteCoupen}=require("../controller/coupenCtrl")


router.post("/",authmiddleware,restrictToUser(["admin"]),createCoupen)
router.get("/",authmiddleware,restrictToUser(["admin"]),getAllCoupen)
router.put("/",authmiddleware,restrictToUser(["admin"]),updateCoupen)

router.delete("/",authmiddleware,restrictToUser(["admin"]),deleteCoupen)
module.exports=router


