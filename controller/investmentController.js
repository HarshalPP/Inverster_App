// Handles investments data
const Inverstor = require("../models/Investment")

// create  a Inverstment //

exports.addInvestment = async(req,res)=>{
    try{

        const {user,company,amount,round}=req.body

        const CreateInvester = new Inverstor({
            user,company,amount,round
        })

        const result = await CreateInvester.save();
        console.log("result data is" , result)

        res.status(201).json({
            message:'Investment is Done...',
            data:result 
        })





    }catch(error){

    }
}


