import express from "express";

import { getAdminDashboard ,getAllUsers,deleteUser,  getAllBloodRequests,updateBloodRequestStatus, getAllDonors,
  verifyDonor,} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

//to see the admin dashboard
router.get("/dashboard",protect,allowRoles("admin"),getAdminDashboard);

//to see the all the users
router.get("/users",protect,allowRoles("admin"),getAllUsers);

//to delete the users(donor+requester)
router.delete("/users/:userId",protect,allowRoles("admin"),deleteUser);

//to get all the blood request
router.get("/blood-requests",protect,allowRoles("admin"),getAllBloodRequests);

//to upadate blood request status
router.put("/blood-requests/:requestId/status",protect,allowRoles("admin"),updateBloodRequestStatus);

//to get all the donors
router.get("/donors",protect,allowRoles("admin"),getAllDonors);

//to verify the donors(false/true)
router.put("/donors/:donorId/verify",protect,allowRoles("admin"),verifyDonor);

export default router;