const Contact = require('../models/Contact');

const submitFeedback = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const newFeedback = new Contact({ name, email, message });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitFeedback };
