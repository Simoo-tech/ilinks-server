const express = require("express");
const {
  getUserById,
  updateUserData,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);

router.route("/:id").get(getUserById).put(updateUserData).delete(deleteUser);

module.exports = router;
