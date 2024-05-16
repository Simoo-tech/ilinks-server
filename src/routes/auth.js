const express = require("express");
const {
  register,
  login,
  resetPassword,
  sendPassLink,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-reset-password", sendPassLink);
router.route("/reset-password/:id").put(resetPassword);

module.exports = router;
