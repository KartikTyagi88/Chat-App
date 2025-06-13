import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute ,updateProfile)    // This is a protected route as we have to made sure that the user is loggedIn before using this controller.
router.get("/check", protectRoute, checkAuth)            //Whenever we refresh the page, we want to check whether the user is authenticated or not.

export default router;