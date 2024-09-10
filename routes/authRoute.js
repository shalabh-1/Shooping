const {Router}=require("express");
const { creatUser,
    loginUserContrl,
    getallUser,
    getaUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser, 
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordtoken,
    resetPassword,
    loginAdminContrl,
    addtoWishlist,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyUserCart,
    applyCoupen,
    createOrder,
    getOrders,
    updateOrderStatus,
    getTotalMonthSale
        
} = require("../controller/userCtrl");
const { authmiddleware,restrictToUser } = require("../middleware/authMiddleware");
const router=Router();


router.post("/register",creatUser)
router.post("/login",loginUserContrl)
router.get('/refresh',  handleRefreshToken)
router.post('/logout',logout)
router.post('/admin-login',loginAdminContrl)
router.put("/wishlist",authmiddleware,addtoWishlist)
// upadte password 
router.get("/get-wishlist",authmiddleware,getWishList)
router.put("/password",authmiddleware,updatePassword)
router.post('/forgot-password-token',forgotPasswordtoken)
router.put("/reset-password/:token",resetPassword)
router.get("/all-users",authmiddleware,restrictToUser(["admin"]),getallUser)
router.get("/cart",authmiddleware,getUserCart)
router.get("/:id",getaUser)
router.delete("/clearcart",authmiddleware,emptyUserCart)
router.delete('/:id',authmiddleware,restrictToUser(["admin"]),deleteUser)

router.put('/edit-user',authmiddleware,updateUser)
router.post("/block-user/:id",authmiddleware,restrictToUser(["admin"]),blockUser)
router.post("/unblock-user/:id",authmiddleware,restrictToUser(["admin"]),unblockUser)
router.put("/save-Address",authmiddleware,saveAddress)
router.post("/cart",authmiddleware, userCart)
router.post("/apply-coupen",authmiddleware,applyCoupen)
router.post("/create/order",authmiddleware,createOrder)
router.get("/order/Summary",authmiddleware,getOrders)
router.put("/order/updateStatus/:odId",authmiddleware,restrictToUser(["admin"]),updateOrderStatus)

router.get("/total/MonthSales",authmiddleware,restrictToUser(["admin"]),getTotalMonthSale)
module.exports=router;


