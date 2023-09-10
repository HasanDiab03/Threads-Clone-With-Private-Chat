import express from "express";
const router = express.Router();
import {
  signupUser,
  loginUser,
  // logoutUser,
  followAndUnFollowUser,
  updateUser,
  getUserProfile,
  getSearchedUsers,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

router.get("/search", getSearchedUsers); 
router.get("/profile/:username", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
// router.post("/logout", logoutUser);
router.patch("/follow/:id", protectRoute, followAndUnFollowUser);
router.patch("/update/:id", protectRoute, updateUser);

export default router;
