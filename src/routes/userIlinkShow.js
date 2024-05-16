const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { UserSc } = require("../models/UserSchema");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { username } = req.body;
    const userIlink = await UserSc.findOne({ username })
      .select("-password -passwordcon")
      .populate("IlinkData");
    if (!userIlink) {
      res.status(400).send({ success: false, message: "no user found" });
    }
    res.status(200).send({ success: true, userIlink });
  })
);

module.exports = router;
