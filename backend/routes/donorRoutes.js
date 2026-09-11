import express from "express";

import { createDonorProfile } from "../controllers/donorController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/profile", protect, allowRoles("donor"), createDonorProfile);

export default router;