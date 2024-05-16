const bcrypt = require("bcryptjs");
const {
  UserSc,
  ValCreateUser,
  ValLoginUser,
  validateResetPass,
} = require("../models/UserSchema");
const asyncHandler = require("express-async-handler");
const jwi = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

// NODEMAILER STUFF
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

/**
 * @desc create a new user
 * @route /auth/register
 * @method POST
 * @access public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, passwordcon } = req.body;
  const { error } = ValCreateUser(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  // check if user exist
  let UserEmail = await UserSc.findOne({ email });
  let UserName = await UserSc.findOne({ username });
  if (UserEmail) {
    return res
      .status(401)
      .send({ message: "Email already registered", success: false });
  } else if (UserName) {
    return res
      .status(401)
      .send({ message: "username already taken", success: false });
  }
  /////////
  // hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const hashPasswordCon = await bcrypt.hash(passwordcon, 10);
  // new user
  const newUser = new UserSc({
    username,
    email,
    password: hashPassword,
    passwordcon: hashPasswordCon,
  });
  const Access_Token = jwi.sign(
    { id: newUser._id },
    process.env.TOKEN_KEY_LOGIN,
    {
      expiresIn: "1h",
    }
  );
  console.log(Access_Token);
  await newUser.save();
  return res.status(201).send({
    newUser,
    success: true,
    Access_Token,
  });
});

/**
 * @desc login
 * @route /auth/login
 * @method POST
 * @access public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { error } = ValLoginUser(req.body);
  if (error) {
    return res
      .status(401)
      .send({ message: error.details[0].message, success: false });
  }
  // check email is exist
  let user = await UserSc.findOne({ email }).populate("IlinkData");
  if (!user) {
    return res
      .status(401)
      .send({ message: " Email or Password is not correct", success: false });
  }
  // check password
  passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    res
      .status(401)
      .send({ message: "Email or Password is not correct", success: false });
  }

  // generate new token
  const Access_Token = jwi.sign({ id: user._id }, process.env.TOKEN_KEY_LOGIN, {
    expiresIn: "1h",
  });

  res.status(201).send({ user, success: true, Access_Token });
});

/**
 * @desc reset password
 * @route /auth/resetpassword
 * @method POST
 * @access public
 */
const sendPassLink = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserSc.findOne({ email }).select("email username");

  if (!user) {
    res
      .status(404)
      .send({ message: "we cannot find your email", success: false });
  }

  // url
  const newID = uuidv4();
  const PassToken = jwi.sign({ newID }, process.env.TOKEN_PASS_KEY, {
    expiresIn: 600000,
  });
  const encodedToken = encodeURIComponent(PassToken).replace(/\./g, "%2E");

  // details message
  const mailOptions = {
    from: `Ilinks ${process.env.AUTH_EMAIL}`,
    to: email,
    subject: "Reset Password",
    title: "Reset your password",
    html: `
    <!DOCTYPE html>
    <html>  
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>ilinks reset Passord confirmation</title>
    </head>
    <body>
      <div style="background-color: #eee; padding:5px 10px; height: 300px; over-flow:scroll">
        <h2 style="text-align: center; color:black ; text-transform:capitalize;">Hello, ${user.username} </h2>
        <h3 style="color:black">You recently requested a new password </h3>
        <div>
        <h3 style="color:black; line-height:1.2;">
        Please click link below to complete your new password request,
        <br/>
        <a
        href="https://ilinks-api.onrender.com/auth/reset-password/${encodedToken}" style="font-size: 14px;">
        https://ilinks-api.onrender.com/resetpassword/${encodedToken}
        </a>
        </h3>
        <p style='color:black; font-weight:bold'>this link will expire after 10 minute</p>
        <h4 style='color:black;'>If you don't want to reset your password you can forget this message</h4>
        </div>
        <h3 style="color:black ;">Thanks,<br />
        Ilinks</h3>
      </div>
    </body>  
    </html>
    `,
  };
  res.cookie("PR", encodedToken, { httpOnly: true, maxAge: 360000 });
  // sent email
  await transporter.sendMail(mailOptions, async (err) => {
    if (err) {
      return res.status(404).send({ message: err, success: false });
    } else {
      return res.status(201).send({
        message: "email has sent",
        encodedToken,
        userID: user._id,
        success: true,
      });
    }
  });
});

/**
 * @desc reset password
 * @route /auth/resetpassword/:id
 * @method PUT
 * @access public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password, passwordcon } = req.body;
  const { error } = validateResetPass(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0].message, success: false });
  }
  const hashPass = await bcrypt.hash(password, 10);
  const hashPassCon = await bcrypt.hash(passwordcon, 10);
  await UserSc.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        password: hashPass,
        passwordcon: hashPassCon,
      },
    },
    { new: true }
  );
  res
    .status(200)
    .send({ message: "passwords updated successfully", success: true });
});

module.exports = {
  register,
  login,
  resetPassword,
  sendPassLink,
};
