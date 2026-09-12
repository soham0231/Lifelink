import User from "../models/User.js";
import DonorProfile from "../models/DonorProfile.js";
import BloodRequest from "../models/BloodRequest.js";

//to get admin dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalDonors = await User.countDocuments({
      role: "donor",
    });

    const totalRecipients = await User.countDocuments({
      role: "recipient",
    });

    const totalDonorProfiles = await DonorProfile.countDocuments();

    const totalBloodRequests = await BloodRequest.countDocuments();

    const openRequests = await BloodRequest.countDocuments({
      status: "open",
    });

    const fulfilledRequests = await BloodRequest.countDocuments({
      status: "fulfilled",
    });

    const cancelledRequests = await BloodRequest.countDocuments({
      status: "cancelled",
    });

    const criticalRequests = await BloodRequest.countDocuments({
      urgency: "critical",
      status: "open",
    });

    res.status(200).json({
      message: "Admin dashboard data fetched successfully",
      statistics: {
        totalUsers,
        totalDonors,
        totalRecipients,
        totalDonorProfiles,
        totalBloodRequests,
        openRequests,
        fulfilledRequests,
        cancelledRequests,
        criticalRequests,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to get all the users(donor+requester)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to deletes the users by admin
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.userId) {
      return res.status(400).json({
        message: "Admin cannot delete their own account",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to get all the blood request
export const getAllBloodRequests = async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find()
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bloodRequests.length,
      bloodRequests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to update the blood request status 
export const updateBloodRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["open", "fulfilled", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    bloodRequest.status = status;

    await bloodRequest.save();

    res.status(200).json({
      message: "Blood request status updated successfully",
      bloodRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to get all the donors
export const getAllDonors = async (req, res) => {
  try {
    const donors = await DonorProfile.find()
      .populate("user", "name email gender")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: donors.length,
      donors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to verify the donor(false/true)
export const verifyDonor = async (req, res) => {
  try {
    const { donorId } = req.params;

    const donorProfile = await DonorProfile.findById(donorId);

    if (!donorProfile) {
      return res.status(404).json({
        message: "Donor profile not found",
      });
    }

    donorProfile.isVerified = true;

    await donorProfile.save();

    res.status(200).json({
      message: "Donor verified successfully",
      donorProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};