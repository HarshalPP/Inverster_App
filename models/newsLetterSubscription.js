const mongoose = require('mongoose');
const { subscribe } = require('../router');

const newsletterSubscriberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  consent: { type: Boolean, required: false },  // GDPR compliance
  subscribedAt: { type: Date, default: Date.now },
  subscriber:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    default:[]
  }],
  Newsletter:{
    type:String,
    enum:['true','false'],
    default:'false'
   }
});

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);

module.exports = NewsletterSubscriber;
