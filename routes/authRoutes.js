const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User'); // Make sure path is correct
const authMiddleware = require('../middleware/auth');

// 🔐 Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🔓 Login with optional 2FA
router.post('/login', async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    if (user.twoFAEnabled) {
      if (!token) return res.status(401).send('2FA token required');

      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        encoding: 'base32',
        token
      });

      if (!verified) return res.status(401).send('Invalid 2FA token');
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🔐 Enable 2FA - Generates secret and QR
router.post('/enable-2fa', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    const secret = speakeasy.generateSecret({
      name: `EventManager (${user.email})`
    });

    user.twoFASecret = secret.base32;
    await user.save();

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) return res.status(500).send('Error generating QR');

      res.json({
        message: 'Scan QR with Authenticator app',
        qrCode: data_url,
        secret: secret.base32
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ✅ Verify 2FA token and enable 2FA
router.post('/verify-2fa', authMiddleware, async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.twoFASecret) return res.status(400).send('2FA not setup');

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token
    });

    if (verified) {
      user.twoFAEnabled = true;
      await user.save();
      res.send('2FA enabled successfully');
    } else {
      res.status(400).send('Invalid 2FA token');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
