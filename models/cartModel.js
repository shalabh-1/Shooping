const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
   
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"   
            },
            count:Number,
            color:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Colors"
            },
            price:Number
        }
    ],

    cartTotal:Number,

    totalAfterDiscount:Number,
    
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    currency:String

},
{
    timestamps:true
}

);

//Export the model
module.exports = mongoose.model('Cart', userSchema);