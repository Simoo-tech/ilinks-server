const { UserSc, ValUpdateUser } = require("../models/UserSchema");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

/**
 * @desc get all users
 * @route /user
 * @method get
 * @access public
 */
const getAllUsers = asyncHandler(async (req, res) => {
  let usersjobs = await UserSc.find({ jobtitle: { $exists: true } })
    .select("jobtitle username avatar IlinkData")
    .populate("IlinkData");
  res.status(200).send({ usersjobs, success: true });
});

/**
 * @desc get user by id
 * @route /user/:id
 * @method get
 * @access public
 */

const getUserById = asyncHandler(async (req, res) => {
  const { username } = req.body;
  // get token
  user_id = await jwt.decode(req.params.id).id;
  // check user session
  user_session = await jwt.verify(
    req.params.id,
    process.env.TOKEN_KEY_LOGIN,
    function (err) {
      if (err) {
        return res.status(401).send({ message: "session end", success: false });
      }
    }
  );
  /////////

  if (username) {
    const user = await UserSc.findOne(user_id)
      .select("-password -passwordcon ")
      .populate("IlinkData");
    res.status(200).send({ user, success: true });
  }
  // get user data
  const user = await UserSc.findById(user_id)
    .select("-password -passwordcon ")
    .populate("IlinkData");
  res.status(200).send({ user, success: true });
});

/**
 * @desc update user
 * @route /user/:id
 * @method put
 * @access public
 */

const updateUserData = asyncHandler(async (req, res) => {
  const { error } = ValUpdateUser(req.body);
  if (error) {
    res.status(400).send({ message: error.details[0], success: false });
  }
  const user = await UserSc.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  ).select("-password -passwordcon");

  res
    .status(201)
    .send({ message: "data updated successfully", user, success: true });
});

/**
 * @desc delete user
 * @route /user/:id
 * @method delete
 * @access public
 */
const deleteUser = asyncHandler(async (req, res) => {
  let user = await UserSc.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ message: "User not found", success: false });
  }

  user = await UserSc.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "account deleted", success: true });
});

module.exports = { getUserById, updateUserData, deleteUser, getAllUsers };
