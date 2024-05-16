const express = require("express");
const router = express.Router();
const {
  UpdateAvatarFiles,
  UploadAvatarFiles,
} = require("../controllers/uploadAvatar");
const {
  UploadedPortfolioImgs,
  UpdatePortfolioFiles,
  UploadPortfolioFiles,
} = require("../controllers/uploadPortfolioImgs");
const { VerifyUser } = require("../middleware/verifyUser");

// avatar upload && update image
router.put(
  "/avatar/:id",
  VerifyUser,
  UploadAvatarFiles.single("file"),
  UpdateAvatarFiles
);

// portfolio upload && update image
router.put(
  "/portfolioImg/:id",
  VerifyUser,
  UploadPortfolioFiles.single("file"),
  UpdatePortfolioFiles
);

module.exports = router;
