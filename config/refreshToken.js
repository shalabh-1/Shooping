var jwt = require('jsonwebtoken');

const generateRefereshToken=(user)=>{

    const token=jwt.sign({
        id:user._doc._id,
        firstname:user._doc.firstname,
        lastname:user._doc.lastname,
        email:user._doc.email,
        isAdmin:user._doc.isAdmin
        
    },process.env.secretkey,{ expiresIn: "3d" })
    return token
}
// issuer
// audiance
module.exports={generateRefereshToken}
