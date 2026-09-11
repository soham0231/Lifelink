import express from "express";

import { respondToBloodRequest} from "../controllers/donorResponseController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/:requestId/respond",
  protect,
  allowRoles("donor"),
  respondToBloodRequest
);

export default router;