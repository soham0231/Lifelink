import express from "express";

import {createBloodRequest,getBloodRequests,getMatchingDonors, getBloodRequestResponses, updateBloodRequest,
  cancelBloodRequest} from "../controllers/bloodRequestController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

//route to create the blood request by the requester
router.post("/",protect,allowRoles("recipient"),createBloodRequest);

//route to see all the blood request 
router.get("/",protect,getBloodRequests);

//route to see matching donor for requester
router.get("/:requestId/matches",protect,allowRoles("recipient"),getMatchingDonors);

//route to see who aceeptes /declined the request
router.get("/:requestId/responses", protect, allowRoles("recipient"), getBloodRequestResponses);

//route to update the blood request
router.put("/:requestId",protect,allowRoles("recipient"),updateBloodRequest);

//routes to delete the blood request
router.delete("/:requestId",protect,allowRoles("recipient"),cancelBloodRequest);


export default router;