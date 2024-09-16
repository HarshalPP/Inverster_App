const mongoose = require("mongoose")
const URL= process.env.MONGO_URL

exports.ConnectDb =async()=>{
    try{
    const connection = await mongoose.connect('mongodb+srv://hariom:abcd1234@college-counselling-por.2pnmyhh.mongodb.net/?retryWrites=true&w=majority',{
    })
    console.log("Mongodb is connected")
}
catch(error){
    console.error(err);
    process.exit(1);
}
}