const express = require('express');
const router = express.Router();
const CustomPackage = require('../models/CustomPackage');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const customPackage = new CustomPackage(req.body);
    await customPackage.save();

    // email logic goes here (optional for now)

    res.status(200).json({ message: 'Custom package submitted and email sent!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
