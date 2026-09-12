import express from "express";

import { createDonorProfile, updateDonorProfile,getDonorProfile } from "../controllers/donorController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

//to create the donor profile
router.post("/profile", protect, allowRoles("donor"), createDonorProfile);

//to update the donor profile
router.put("/profile",protect,allowRoles("donor"),updateDonorProfile);

//to get/see/aacces the donor profile
router.get("/profile",protect,allowRoles("donor"),getDonorProfile);



export default router;