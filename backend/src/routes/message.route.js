import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar , getMessages , sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);    //This will give all the users
router.get("/:id", protectRoute, getMessages);         //This will give the messages sent between the user and the userId user.
router.post("/send/:id", protectRoute, sendMessage);

export default router;