const { IlinkDataSc } = require("../models/IlinkDataSc");
const asyncHandler = require("express-async-handler");
const { UserSc } = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
/**
 * @desc create ilink data
 * @route /ilinkData/create-ilink
 * @method POST
 * @access public
 */
const createIlinkData = asyncHandler(async (req, res) => {
  // check if their is data exist
  const { email } = req.body;
  const userExist = await UserSc.findOne({ email });
  if (userExist.IlinkData === null) {
    res.status(401).send({ message: "data already exists", success: false });
  }

  const UserIlinkData = new IlinkDataSc({
    portfolio: [],
    skills: [],
  });
  await UserIlinkData.save();
  res.status(201).send({ IlinkID: UserIlinkData._id, success: true });
});

/**
 * @desc update ilink data
 * @route /ilinkData/update-ilink/:id
 * @method PUT
 * @access public
 */
const updateIlinkData = asyncHandler(async (req, res) => {
  const updateData = await IlinkDataSc.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true, runValidators: true }
  );
  res
    .status(200)
    .send({ message: "data updated successfully", updateData, success: true });
});

/**
 * @desc delete ilink data
 * @route /ilinkData/:id
 * @method DELETE
 * @access public
 */
const deleteIlnik = asyncHandler(async (req, res) => {
  const updateData = await IlinkDataSc.findByIdAndDelete(req.params.id);
  if (!updateData) {
    res.status(404).send({ message: "Form data not found", success: false });
  }
  await FormDataSc.findByIdAndDelete(req.body.updateData);
  res
    .status(200)
    .send({ message: "form data deleted successfully", success: true });
});

/**
 * @desc get user and ilink data id
 * @route /
 * @method PUT
 * @access public
 */
const Join_Ilink_User = asyncHandler(async (req, res) => {
  const userToken = jwt.decode(req.body.userID).id;
  const IlinkId = await IlinkDataSc.findById(req.body.IlinkID);
  // link the databases
  const user = await UserSc.findById(userToken);
  user.IlinkData = IlinkId;
  await user.save();
  res.send({ IlinkData: user.IlinkData, success: true });
});

module.exports = {
  createIlinkData,
  updateIlinkData,
  Join_Ilink_User,
  deleteIlnik,
};
