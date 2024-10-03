const mongoose = require("mongoose")
const consignorInfoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    consignorName: { type: String, required: true },
  }, { collection: 'consignor_info' });
  
module.exports =  mongoose.model('ConsignorInfo', consignorInfoSchema);