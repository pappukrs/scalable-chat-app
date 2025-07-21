const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const signToken = (payload) => jwt.sign(payload, secret, { expiresIn: '1h' });
module.exports = { signToken };
