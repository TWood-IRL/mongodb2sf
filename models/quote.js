const mongoose = require('mongoose');

// Customer Schema
const quoteSchema = mongoose.Schema({
  accName: { type: String },
  eligibleLives: { type: Number },
  sentRFP: { type: Boolean,default: false },

});

// Define and export
module.exports = mongoose.model('Quote', quoteSchema);