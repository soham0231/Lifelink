import express from "express";

import { respondToBloodRequest} from "../controllers/donorResponseController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

//routes for donor to respond to accept or decline
router.post("/:requestId/respond",protect,allowRoles("donor"),respondToBloodRequest);

export default router;