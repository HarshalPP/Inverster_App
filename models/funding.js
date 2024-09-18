const mongoose = require('mongoose');

const fundingRoundSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  round: { type: String, required: true },  // The round (e.g., Seed, Series A, Series B)
  amountRaised: { type: Number, required: true },  // Amount raised in this round
  date: { type: Date, required: true }  // Date of the funding round
},{
  timestamps:true
});

module.exports = mongoose.model('FundingRound', fundingRoundSchema);
