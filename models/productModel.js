const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
        
    },
    price:{
        type:Number,
        required:true,
    },
    // category:{
    //    type:mongoose.Schema.Types.ObjectId,
    //    ref:"category" 
    // },
    category:{
        type:String,
        required:true,
     },
    quantity:{
        type:Number,
        required:true,
        select:false
    },
    sold:{
        type:Number,
        default:0,
        // use to hide sold from user
        select:false
    },

    brand:{
        type:"String",
        enum:["Apple","Samsung","Lenovo","Hp"]
    },
    
  

    // color:{
    //     type:String,
    //     enum:['Black','Brown','Red','Yellow','Green'],
    //     required:"true"
    // },
    images:[],
    color:[],
    tags:[],

    rating:[{
        star:Number,
        comment:String,
        postedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }

    }],

    totalrating:{
        type:Number,
        default:0

    }         
},{timestamps:true});

//Export the model
module.exports = mongoose.model('Product', productSchema);