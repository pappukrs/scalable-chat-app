const User = require('../models/user');
const { generateOtp } = require('../services/otpService');
const { signToken } = require('../services/jwtService');

exports.signup = async (req, res) => {
  const { email, phone } = req.body;
  try {
    const user = await User.create({ email, phone });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { phone } = req.body;
  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  const user = await User.findOne({ where: { phone } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.otp = otp;
  user.otp_expiry = expiry;
  await user.save();

  console.log(`📩 OTP for ${phone}: ${otp}`);
  res.json({ message: 'OTP sent (check console)' });
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ where: { phone } });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  const token = signToken({ id: user.id, phone: user.phone });
  res.json({ message: 'Login successful', token });
};
