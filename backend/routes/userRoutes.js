import express from "express";
import { registerUser, loginUser} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "You can access this protected route!",
    user: req.user,
  });
});

router.get("/admin-test", protect, allowRoles("admin"), (req, res) => {
  res.json({
    message: "Welcome Admin!",
  });
});

export default router;