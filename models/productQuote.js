const mongoose = require('mongoose');
const Quote = require('./quote');

// Customer Schema
const productQuote = mongoose.Schema({
  quoteId: { type: String },
  productName: { type: String },

});

// Define and export
module.exports = mongoose.model('productQuote', productQuote);