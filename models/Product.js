const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
}, { timestamps: true });

const Product0 = mongoose.model('Product0', productSchema, 'product_0');
const Product1 = mongoose.model('Product1', productSchema, 'product_1');
const Product2 = mongoose.model('Product2', productSchema, 'product_2');
const Product3 = mongoose.model('Product3', productSchema, 'product_3');
const Product4 = mongoose.model('Product4', productSchema, 'product_4');
const Product5 = mongoose.model('Product5', productSchema, 'product_5');

module.exports = { Product0, Product1, Product2, Product3, Product4, Product5 };
