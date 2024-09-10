
const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto=require("crypto")

const roleSchema = new mongoose .Schema({
    name: {
        type: String,
        required: true,
        enum: ['admin', 'user'] // Enum ensures only these roles can be assigned
    },
    permissions: {
        type: [String],
        enum: ['read', 'write', 'delete'], // Enum ensures only these permissions can be assigned
        default: []
    }
});

var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
      
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },

    isAdmin:{
        type:String,
        // enum: ['admin', 'user'],
        default:'user'
 
    },
    isBlocked:{
        type:Boolean,
        default:false
    },

    cart:{
        type:Array,
        default:[]
    },
    // address:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"address"

    // }]
    address:String
    ,

    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }],
    refreshToken:{
      type:String  
    },
    // roles: [roleSchema]
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date
    
},

{
timestamps:true
}
);

userSchema.pre("save", async function(next){

    if (this.isModified('password')) {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
           
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            next(error); // Pass error to the next middleware if hashing fails
        }
    }else{
        next()
    }

})


userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken=async function(){
    // passwordResetToken=>When a user requests to reset their password, a reset token is generated 
    // and sent to the user (typically via email). This token allows the user to reset their password
    // . However, for security reasons, this token should only be valid for a limited period.
    const resettoken= crypto.randomBytes(30).toString("hex");
    this.passwordResetToken=crypto.createHash('sha256').update(resettoken).digest('hex')
   
    // passwordResetExpires: This field stores the expiration date and time for the password 
    // reset token. If the current
    //  date and time exceed this value, the token is considered expired and can no longer be used.
    this.passwordResetExpires=Date.now()+30*60*1000 // 10 munutes 
   
    return resettoken
    
}

// passwordResetExpires is a field commonly used in applications 
// that implement a password reset feature. 
// It stores a date and time value (Date in JavaScript) 
// that indicates when the user's password reset token will expire.

// Explanation of passwordResetExpires
// Purpose: When a user requests to reset their password, a  reset token is generated 
// and sent to the user (typically via email). This token allows the user to reset
//  their password. However, for security reasons, this token should only be valid for 
// a limited period.
// passwordResetExpires: This field stores the expiration date and time for the password reset token. If the current date and time exceed this value, the token is considered expired and can no longer be used.
// How It Works
// User Requests Password Reset:

// The user initiates a password reset request (e.g., by clicking a "Forgot Password" link).
// Generate Reset Token:

// The server generates a unique password reset token (often a random string).
// The server also sets a passwordResetExpires field to a future date and time (e.g., 1 hour from the current time).
// Send Reset Token to User:

// The reset token is sent to the user via email or another secure method.
// User Uses the Reset Token:

// The user clicks the link containing the reset token and submits a new password.
// Validate the Token:

// The server checks if the token provided by the user matches the token stored in the database and also checks if the current date and time are before the passwordResetExpires value.
// If the token has expired (currentDate > passwordResetExpires), the reset request is rejected, and

//Export the model
module.exports = mongoose.model('User', userSchema);
