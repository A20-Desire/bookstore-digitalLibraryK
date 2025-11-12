import express from "express";
import { getDashboardMetrics } from "../controller/analytics.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/overview", authenticate, authorizeRoles("admin"), getDashboardMetrics);

export default router;
