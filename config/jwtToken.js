const jwt = require('jsonwebtoken');

const generateToken=(user)=>{

    const token=jwt.sign({
        id:user._doc._id,
        firstname:user._doc.firstname,
        lastname:user._doc.lastname,
        email:user._doc.email,
        isAdmin:user._doc.isAdmin
        
    },process.env.secretkey,{ expiresIn: "1d" })
    return token
}

const validateToken=(token)=>{

    return jwt.verify(token, process.env.secretkey);
}


module.exports={
    generateToken,validateToken
}
