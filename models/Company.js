// models/Company.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // URL of the company's logo
  description: { type: String },
  industry: { type: String },
  stage: { type: String }, // e.g., Seed, Series A, etc.
//   investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
  fundingRounds: [{ type: String }], // E.g., Seed, Series A, Series B
  updates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
  createdAt: { type: Date, default: Date.now },
},{
    timestamps:true
} )


module.exports = mongoose.model('Company', companySchema);
