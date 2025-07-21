const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/verify-otp', auth.verifyOtp);
router.get('/profile', requireAuth, (req, res) => {
  res.json({ message: `Hello ${req.user.phone}! This is your profile.` });
});


module.exports = router;
