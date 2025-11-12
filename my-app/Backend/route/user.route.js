import express from "express";
import {
	deactivateUser,
	getProfile,
	listUsers,
	login,
	signup,
	updateProfile,
	updateUserRole,
} from "../controller/user.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authenticate, getProfile);
router.patch("/me", authenticate, updateProfile);

router.get("/", authenticate, authorizeRoles("admin"), listUsers);
router.patch("/:id/role", authenticate, authorizeRoles("admin"), updateUserRole);
router.post("/:id/deactivate", authenticate, authorizeRoles("admin", "moderator"), deactivateUser);

export default router;
