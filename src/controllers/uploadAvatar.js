const asyncHandler = require("express-async-handler");
const { UserSc } = require("../models/UserSchema");
const multer = require("multer");

// multer upload avatar
const date = new Date().getHours() + new Date().getSeconds();
const maxSize = 2 * 1024 * 1024; // 2 MB

// mutlter storage
const UploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/avatar");
  },
  filename: function (req, file, cb) {
    return cb(null, `${date}-${file.originalname}`);
  },
});
// file filter
const UploadAvatarFiles = multer({
  storage: UploadStorage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb("file type not supported", false);
    }
    cb(null, "upload successfully");
  },
});

/**
 * @desc UPLOAD AVATAR PHOTO
 * @route /upload-avatar/:id
 * @method PUT
 * @access public
 */
const UpdateAvatarFiles = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send({ success: false, message: "no file choose" });
  }

  const path = process.env.SERVER_URL_LOCALHOST + "avatar/" + file.filename;

  let user = await UserSc.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        avatar: path,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).send({
    avatar: user.avatar,
    success: true,
    message: "upload successfully",
  });
});

module.exports = { UpdateAvatarFiles, UploadAvatarFiles };
