const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { UserSc } = require("../models/UserSchema");

router.get(
  "/:username",
  asyncHandler(async (req, res) => {
    const username = req.params.username;
    const userIlink = await UserSc.findOne({ username })
      .select("-password -passwordcon")
      .populate("IlinkData");

    if (!userIlink) {
      res.status(400).send({ success: false, message: "No User Found" });
    }
    res.status(200).send({ success: true, userIlink });
  })
);

module.exports = router;
