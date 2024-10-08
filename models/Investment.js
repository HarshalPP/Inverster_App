// models/Investment.js
const mongoose = require('mongoose');
const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  amount: { type: String, required: true },
  round: { type: String, required: true },
  date: { type: Date, default: Date.now() },
},{
  timestamps:true
});

module.exports = mongoose.model('Investment', investmentSchema);
