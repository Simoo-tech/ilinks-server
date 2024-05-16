const express = require("express");
const {
  Join_Ilink_User,
  createIlinkData,
  deleteIlnik,
  updateIlinkData,
} = require("../controllers/ilinkDataController");
const router = express.Router();
const { VerifyUser } = require("../middleware/verifyUser");

router.post("/create-ilink", VerifyUser, createIlinkData);
router.put("/update-ilink/:id", VerifyUser, updateIlinkData);
router.put("/", VerifyUser, Join_Ilink_User);
router.delete("/:id", deleteIlnik);
module.exports = router;
