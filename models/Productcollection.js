const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  consignorId: { type: Number, required: true },
  consignorName: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
}, { collection: 'product_3' });

module.exports =  mongoose.model('Productcollection', productSchema);