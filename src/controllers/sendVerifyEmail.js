const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
const { UserSc } = require("../models/UserSchema");

// NODEMAILER STUFF
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

/**
 * @desc verify email
 * @route /verify/:id
 * @method POST
 * @access public
 */

const VerifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserSc.findOne({ email });
  // new code generator
  const newCode = Math.floor(Math.random() * 900000) + 100000;
  const mailOptions = {
    from: `Ilinks ${process.env.AUTH_EMAIL}`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h3>Verify Your Email</h3>
      <p>your code is ${newCode}</p>`,
  };
  user.code = newCode;
  await user.save();
  await transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(400).send({ message: err, success: false });
    } else {
      return res
        .status(200)
        .send({ message: "check your email ", success: true });
    }
  });
});

module.exports = VerifyEmail;
