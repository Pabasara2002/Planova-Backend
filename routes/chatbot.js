const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to JSON data
const dataPath = path.join(__dirname, '../data/packages.json');

// POST endpoint to receive user message and return matching FAQ answer
router.post('/', (req, res) => {
  const userMessage = req.body.message?.toLowerCase();

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }

    const jsonData = JSON.parse(data);
    const faqs = jsonData.faq || [];

    const matched = faqs.find(faq =>
      userMessage.includes(faq.q.toLowerCase())
    );

    if (matched) {
      res.json({ reply: matched.a });
    } else {
      res.json({ reply: "Sorry, I couldn't find an answer to your question." });
    }
  });
});

module.exports = router;
