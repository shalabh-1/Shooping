const { generateToken } = require("../config/jwtToken.js")
const User = require("../models/userModel.js")
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
const validateId = require("../utils/validateMongoDb.js");
const { generateRefereshToken } = require("../config/refreshToken.js");
var jwt = require('jsonwebtoken');
const { sendEMail } = require("./emailCtrl.js");
const crypto = require("crypto")
const Blog = require("../models/blogModel.js")
const Cart = require("../models/cartModel.js")
const Product = require("../models/productModel.js")
const Coupen = require("../models/coupenModel.js")
const Order=require("../models/ordermodel.js")
var uniqid = require('uniqid'); 

const creatUser = asyncHandler(

    async (request, response) => {
        const { email } = request.body
        console.log(request.body);

        const user = await User.findOne({ email });
        if (!user) {
            const roles = [
                { name: 'user', permissions: ['read', 'write'] },
                { name: 'admin', permissions: ['read'] }
            ];

            const newUser = await User.create({
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email,
                password: request.body.password,
                mobile: request.body.mobile,
                roles: roles
            })

            return response.status(200).json({ message: "User created Sucessfully", newUser });

        } else {
            throw new Error("User already exist")
        }


    }
)


const loginUserContrl = asyncHandler(
    async (request, response) => {

        const { email, password } = request.body
        const findUser = await User.findOne({ email })
        if (findUser && (await findUser.isPasswordMatch(password))) {
            const refereshtoken = generateRefereshToken(findUser);
            const upadteUserToken = await User.findByIdAndUpdate(
                findUser._id,
                {
                    refreshToken: refereshtoken
                }

            )

            response.cookie(
                "refreshToken",
                refereshtoken,
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: 72 * 60 * 60 * 1000

                }
            )
            response.status(200).json({

                "id": findUser._id,
                "name": findUser?.firstname,
                "lastname": findUser?.lastname,
                "email": findUser?.email,
                "mobile": findUser?.mobile,
                "token": generateToken(findUser)
            });

        } else {

            throw new Error("Incorrect credential")
        }
    }

)


const loginAdminContrl = asyncHandler(
    async (request, response) => {

        const { email, password } = request.body
        const findAdmin = await User.findOne({ email })
        // console.log(findAdmin)
        if (findAdmin.isAdmin != "admin") throw new Error("You are unauthorized")

        if (findAdmin && (await findAdmin.isPasswordMatch(password))) {
            const refereshtoken = generateRefereshToken(findAdmin);
            const upadteUserToken = await User.findByIdAndUpdate(
                findAdmin._id,
                {
                    refreshToken: refereshtoken
                }

            )

            response.cookie(
                "refreshToken",
                refereshtoken,
                {
                    httpOnly: true,
                    secure: true,
                    maxAge: 72 * 60 * 60 * 1000

                }
            )
            response.status(200).json({

                "id": findAdmin._id,
                "name": findAdmin?.firstname,
                "lastname": findAdmin?.lastname,
                "email": findAdmin?.email,
                "mobile": findAdmin?.mobile,
                "token": generateToken(findAdmin)
            });

        } else {

            throw new Error("Incorrect credential")
        }
    }

)
// handle refersh token

const handleRefreshToken = asyncHandler(

    async (request, response) => {


        const cookie = request.cookies;
        if (!cookie?.refreshToken) {
            throw new Error("No Refresh token available")
        }
        const refreshToken = cookie.refreshToken
        const user = await User.findOne({ refreshToken })
        if (!user) {
            throw new Error("No Refresh Token is present in a db or not Matched")
        }

        jwt.verify(refreshToken, process.env.secretkey, (error, decoded) => {

            if (error || user._id != decoded.id) {
                throw new Error("There is something wrong with Refresh token ")
            }

        });

        const accessToken = generateToken(user)

        response.status(200).json({ accessToken });



    }
)

const logout = asyncHandler(
    async (request, response) => {

        const cookie = request.cookies
        if (!cookie?.refreshToken) {
            throw new Error("No Refresh token available")
        }
        const refreshToken = cookie?.refreshToken

        const user = await User.findOne({ refreshToken })
        if (!user) {
            response.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,

            })
            return response.sendStatus(204);
        }

        await User.findOneAndUpdate(
            {
                refreshToken
            },
            {
                refreshToken: ""
            }
        )

        response.clearCookie
            (
                "refreshToken",
                {
                    httpOnly: true,
                    secure: true,
                }
            )

        return response.sendStatus(204);


    }


)

const getallUser = asyncHandler(
    async (request, response) => {
        try {
            const getAll = await User.find({});
            response.status(200).json(getAll);
        } catch (error) {
            console.error('Error fetching users:', error);
            response.status(500).json({ message: 'Server error' });
        }
    }
);


const getaUser = asyncHandler(
    async (request, response) => {
        const { id } = request.params;

        validateId(id)


        try {
            const user = await User.findById(id)
            return response.status(200).json({ user })
        } catch (error) {

            throw new Error(error)

        }

    }


)

const deleteUser = asyncHandler(
    async (request, response) => {
        const { id } = request.params;

        try {
            validateId(id)
            const user = await User.findByIdAndDelete(id)
            return response.status(200).json(user)
        } catch (error) {

            throw new Error(error)

        }

    }



)


const updateUser = asyncHandler(

    async (request, response) => {
        // const {id} =request.params;
        const id = request.user.id

        try {
            validateId(id)
            const updateUser = await User.findByIdAndUpdate(id, request.body,
                {
                    new: true,
                }
            )
            return response.status(200).json(updateUser)
        } catch (error) {

            throw new Error(error)

        }

    }

)

// lemon@gmail.com
// sb@gmail.com

const blockUser = asyncHandler(

    async (request, response) => {

        const id = request.params.id;
        try {
            validateId(id)
            await User.findByIdAndUpdate(
                id,
                {
                    isBlocked: true
                },
                {
                    new: true
                }
            )
        } catch (error) {

            throw new Error(error);
        }


        return response.json({ "message": "User Blocked" })

    }

)

const unblockUser = asyncHandler(

    async (request, response) => {

        try {
            const id = request.params.id;
            validateId(id)

            await User.findByIdAndUpdate(
                id,
                {
                    isBlocked: false
                },
                {
                    new: true
                }
            )
            return response.json({ "message": "User Un-blocked" })
        } catch (error) {
            response.status(404);
            throw new Error(error)
        }

    }

)

//  
const updatePassword = asyncHandler(
    async (request, response) => {

        const { id } = request.user
        const { password } = request.body
        validateId(id)

        const user = await User.findById(id)

        if (password) {
            user.password = password
            const updatePassword = await user.save()
            response.json(updatePassword)
        } else {
            response.json(user)
        }


    })


const forgotPasswordtoken = asyncHandler(

    async (request, response) => {

        const { email } = request.body

        const user = await User.findOne({ email })

        if (!user) {
            throw new Error("User Not found")
        }


        try {
            const token = await user.createPasswordResetToken()

            const resetURL = `Please follow the link to reset Your Password, This link is valid till 10 minutes for now <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`
            const data = {
                to: email,
                subject: "forgot password",
                text: "Checking",
                html: resetURL,

            }
            await user.save()
            sendEMail(data)
            response.json(token)
        } catch (error) {
            throw new Error(error)
        }
    }


)

const resetPassword = asyncHandler(


    async (request, response) => {
        const { password } = request.body
        const { token } = request.params

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        console.log(hashedToken)
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: {
                $gte: Date.now()
            }
        }

        )

        if (!user) {

            throw new Error("token Expired or password Reset Token Expired")
        }

        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()


        return response.json(user)

    }


)


const addtoWishlist = asyncHandler(
    async (request, response) => {
        const { id } = request.user;
        const { prodId } = request.body;

        try {
            validateId(id); // Ensure this function exists or is imported correctly
            let user = await User.findById(id); // Use 'let' to allow reassignment

            const AlreadyAdded = user.wishlist.includes(prodId);

            if (AlreadyAdded) {
                user = await User.findByIdAndUpdate(
                    id,
                    {
                        $pull: {
                            wishlist: prodId,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return response.json(user);
            } else {
                user = await User.findByIdAndUpdate(
                    id,
                    {
                        $addToSet: {
                            wishlist: prodId,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return response.json(user);
            }
        } catch (error) {
            throw new Error(error)
        }
    }
)


const getWishList = asyncHandler(

    async (request, response) => {

        try {
            const user = request.user
            // console.log(request.user)
            const findWishlist = await User.findById(user.id).select("wishlist -_id")
            response.json(findWishlist)

        } catch (error) {
            throw new Error(error)
        }


    }


)


const saveAddress = asyncHandler(
    async (request, response) => {
        const user = request.user
        const UpdateAddress = await User.findByIdAndUpdate(user.id, {

            address: request?.body?.Address


        })


        response.json(UpdateAddress)
    }


)


const userCart = asyncHandler(

    async (request, response) => {
        const {id}=request.user
        validateId(id)
        const { productId,  count, price,color } = request.body;

        const cart=await Cart.findOne({orderBy:id})
        if(cart){
            const itemIndex = cart.products.findIndex((item) => item.productId.toString() === productId.toString());

            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                productItem.count = count;
                cart.products[itemIndex] = productItem;
              } else {
                //product does not exists in cart, add new item
                cart.products.push({ productId, count, price,color });
              }
              await cart.save()
        
           
        }else{
           
            cart= new Cart({
                products:[
                    
                    
                    {productId,  count, price,color},
                   
                ],
                orderBy:id

            })
           
          
          
        }

      
        let cartTotal=0;

    
        for(let i=0;i<cart.products.length;i++){
            cartTotal+=cart.products[i].count*cart.products[i].price         

        }
        cart.cartTotal=cartTotal

        await cart.save()
        response.json(cart)

    }
)

const getUserCart = asyncHandler(

    async (request, response) => {

        try {
            const { id } = request.user
            console.log(id)
            validateId(id)
            const cart = await Cart.findOne({ orderBy: id }).populate("products.productId")
            response.json(cart)
        } catch (error) {
            throw new Error(error)
        }
    }


)


const emptyUserCart = asyncHandler(

    async (request, response) => {

        try {
            const { id } = request.user

            validateId(id)
            const deleteCart = await Cart.findOneAndDelete({ orderBy: id }).populate("products.productId")
            response.json(deleteCart)
        } catch (error) {
            throw new Error(error)
        }
    }


)

const applyCoupen = asyncHandler(

    async (request, response) => {

        const { id } = request.user
        const { coupen } = request.body
        console.log(coupen)
        const validateCoupen = await Coupen.findOne({
            name: coupen,
            expiry: {
                $gte: new Date()
            }

        })
        if (!validateCoupen) {
            throw new Error("Invalid Coupen")
        }


        const cart = await Cart.findOne({ orderBy: id }).populate("products.productId")
       
        const totalAfterDiscount = (cart.cartTotal - (cart.cartTotal * validateCoupen.discount) / 100).toFixed(2)
        cart.totalAfterDiscount=totalAfterDiscount 

      
        
        await cart.save()
        return response.json(totalAfterDiscount )
    }



)
const createOrder = asyncHandler(async (request, response) => {
    const { COD, coupenApplied } = request.body;
    const { id } = request.user;
    validateId(id);

    if (!COD) {
        throw new Error("Create Cash Order Failed");
    }

    try {
        // Fetch the user's cart
        let userCart = await Cart.findOne({ orderBy: id })

        if (!userCart) {
            throw new Error("User cart not found");
        }

        let finalAmount = 0;
        if (coupenApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        // Create a new order
        console.log(userCart)
        let order = new Order({
            products: userCart.products, // Assuming productId is an object reference
            paymentIntent: {
                id: uniqid()
            },
            method: "COD",
            amount: finalAmount,
            currency: "INR",
            OrderStatus: "Cash On Delivery",
            orderBy:id,
            month:new Date().toLocaleString('default', { month: 'long' })
        
        });

        await order.save(); // Save the order to the database

        // Prepare bulk write operations for updating product quantities
        let updateOperations = userCart.products.map(product => ({
            updateOne: {
                filter: { _id: product.productId },  // Ensure productId is an ObjectId
                update: {
                    $inc: {
                        quantity: -product.count,  // Reduce quantity
                        sold: product.count        // Increment sold count
                    },

                }
            }
        }));

        // console.log(updateOperations)
        // Perform the bulk write operation
        await Product.bulkWrite(updateOperations,{}); // Use the correct Mongoose model for the collection

        response.json("Order completed");

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

const getOrders=asyncHandler(

    async (request,response)=>{

      const {id}=request.user
      
        try {
            const orders=await Order.findOne({
                orderBy:id
            })
            return response.json(orders)
    
        } catch (error) {
            throw new Error(error)
        }
    }


)

const updateOrderStatus =asyncHandler(

    async (request,response)=>{

      const {id}=request.user
        const { OrderStatus}=request.body
        // orderId
        const {odId}=request.params
        validateId(id);

        try {
            const update=await Order.findByIdAndUpdate(odId,
                {
                OrderStatus
                 },
                 {
                    new:true
                 }
                )
                
            
                response.json(update)
        } catch (error) {
            throw new Error(error)
        }
    }

)

// http://localhost:5000/api/user/total/MonthSales?month=September,August
const getTotalMonthSale=asyncHandler(
    async (request,response)=>{
      
        const {id}=request.user
        try {
            let monthsParam=request.query.month
            const months = monthsParam ? monthsParam.split(',') : [];
              const getAllOrder=await Order.find({
                  month: {
                       $in:months
                      
                      }
              
          })
      
         let totalSalesAmount=0
          for(let i=0;i<getAllOrder.length;i++){
              totalSalesAmount+=getAllOrder[i].amount
              
          }
          response.json({totalSalesAmount})
        } catch (error) {
            

            throw new error(error)
        }
   
    
        


    }

)

module.exports = {
    creatUser, loginUserContrl, getallUser, getaUser, deleteUser, updateUser
    , blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordtoken, resetPassword
    , loginAdminContrl, addtoWishlist, getWishList, saveAddress, userCart, getUserCart, emptyUserCart
    , applyCoupen,createOrder,getOrders,updateOrderStatus,getTotalMonthSale
}



