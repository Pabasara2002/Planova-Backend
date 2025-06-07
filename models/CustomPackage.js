const mongoose = require('mongoose');

const customPackageSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  packageDetails: { type: Object, required: true }, // store all custom data as JSON object
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomPackage', customPackageSchema);

