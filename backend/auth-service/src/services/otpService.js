const generateOtp = () => process.env.MASTER_OTP || "123456";
module.exports = { generateOtp };
