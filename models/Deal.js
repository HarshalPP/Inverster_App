// models/Deal.js
const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalAllocation: { type: Number, required: true },  
  amountCommitted: { type: Number, default: 0 }, 
  committedLPs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  closingDate: { type: Date, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deal', dealSchema);
