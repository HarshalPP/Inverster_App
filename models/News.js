// models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { 
    type: String, required: true 
  },
  content: { 
    type: String, required: true
   },
  company: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Company'
   },
  date: { 
    type: Date, default: Date.now
   },

  readBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ], // Track who has read the news

});

module.exports = mongoose.model('News', newsSchema);
