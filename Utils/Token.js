const User = require("../models/User")

// Genertate the Token 
exports.sendToken = async(user , statusCode , res)=>{
    try{

        const token = user.getSignedToken();
        const data = await User.findByIdAndUpdate(user._id , {activeToken:token}, {new:true})
        return res.status(statusCode).json({
            success:true,
            user
        })

    }
    catch(error){
        return res.status(500).json({
            success: false,
            error: 'An error occurred while sending the token.',
          });
    }
}