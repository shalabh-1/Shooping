const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var OrderSchema = new mongoose.Schema({
  
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"   
            },
            count:Number,
            color:String,
            price:Number,
        }
    ],

    paymentIntent:{},
    OrderStatus:{
        type:String,
        Default:"Not Processed",
        enum:["Not Processed",
            "Cash On Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered"
        ]
    },

    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    month:{
        type:String
    },
    amount:{
        type:Number
    }

},
{
    timestamps:true
}


);

//Export the model
module.exports = mongoose.model('Order', OrderSchema);