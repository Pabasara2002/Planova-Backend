const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  isAddon: Boolean
});

module.exports = mongoose.model('Service', serviceSchema);
