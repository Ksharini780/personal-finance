import express from "express";
import {
  registerControllers,
  loginControllers,
  setAvatarController,
  allUsers,
} from "../controllers/userController.js";

const router = express.Router();

// ✅ Register a new user
router.post("/register", registerControllers);

// ✅ Login an existing user
router.post("/login", loginControllers);

// ✅ Set user avatar
router.post("/setAvatar/:id", setAvatarController);

// ✅ Get all users except the current user
router.get("/allUsers/:id", allUsers);

export default router;
