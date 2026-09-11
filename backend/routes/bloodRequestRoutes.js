import express from "express";

import {createBloodRequest,getBloodRequests,getMatchingDonors} from "../controllers/bloodRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

//route to create the blood request by the requester
router.post("/",protect,allowRoles("recipient"),createBloodRequest);

//route to see all the blood request to the admin
router.get("/",protect,getBloodRequests);

//route to see matching donor for requester
router.get("/:requestId/matches",protect,allowRoles("recipient"),getMatchingDonors);


export default router;