const mongoose = require('mongoose');

// Customer Schema
const productSchema = mongoose.Schema({
  name: { type: String },
});

// Define and export
module.exports = mongoose.model('Product', productSchema);