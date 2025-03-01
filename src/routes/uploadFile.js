const express = require("express");
const router = express.Router();
const multer = require("multer");
const { VerifyUser } = require("../middleware/verifyUser");
const asyncHandler = require("express-async-handler");
const { UserSc } = require("../models/UserSchema");
const cloudinary = require("cloudinary").v2;

// file filter
const maxSize = 20000000; // 2 MB
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb("file type not supported", false);
    }
    cb(null, true);
  },
});

// cloudinary
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * @desc upload avatar photo
 * @route /avatar/:id"
 * @method PUT
 * @access public
 */
router.put(
  "/avatar/:id",
  VerifyUser,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;

    if (!file) {
      res.status(400).send({ success: false, message: "no file choose" });
    }

    // Upload an image
    const img = await cloudinary.uploader.upload(file.path);

    let user = await UserSc.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          avatar: img.secure_url,
        },
      },
      { new: true, runValidators: true }
    );
    res.status(200).send({
      avatar: user.avatar,
      success: true,
      message: "upload successfully",
    });
  })
);
/**
 * @desc upload portfolio photo
 * @route /portfolio-imgs/:id"
 * @method PUT
 * @access public
 */
router.put(
  "/portfolio-imgs/:id",
  VerifyUser,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send({ success: false, message: "no file choose" });
    }
    // Upload an image
    const img = await cloudinary.uploader.upload(file.path);
    res.status(200).send({
      path: img.secure_url,
      success: true,
      message: "upload successfully",
    });
  })
);

module.exports = router;
