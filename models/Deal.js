// models/Deal.js
const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  details: { type: String, required: true },
  closingDate: { type: Date, required: true },
  committedLPs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  allocationProgress: { type: Number, default: 0 }, // Percentage of allocation filled
});

module.exports = mongoose.model('Deal', dealSchema);
