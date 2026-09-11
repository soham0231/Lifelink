import BloodRequest from "../models/BloodRequest.js";
import DonorProfile from "../models/DonorProfile.js";

//to create blood request
export const createBloodRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      unitsRequired,
      hospital,
      city,
      urgency,
      requiredBy,
      contactPhone,
    } = req.body;

    if (
      !patientName ||
      !bloodGroup ||
      !unitsRequired ||
      !hospital ||
      !city ||
      !requiredBy ||
      !contactPhone
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const bloodRequest = await BloodRequest.create({
      requester: req.user.userId,
      patientName,
      bloodGroup,
      unitsRequired,
      hospital,
      city,
      urgency,
      requiredBy,
      contactPhone,
    });

    res.status(201).json({
      message: "Blood request created successfully",
      bloodRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to get all blood request
export const getBloodRequests = async (req, res) => {
  try {
    let bloodRequests;

    if (req.user.role === "recipient") {
      bloodRequests = await BloodRequest.find({
        requester: req.user.userId,
      }).sort({ createdAt: -1 });
    } else if (req.user.role === "admin") {
      bloodRequests = await BloodRequest.find().sort({
        createdAt: -1,
      });
    } else {
      return res.status(403).json({
        message: "Access denied",
      });
    }

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

/////to find the mtching donor with requester profile
export const getMatchingDonors = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the blood request
    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    // Make sure the requester owns this request
    if (
      bloodRequest.requester.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message: "You can only find donors for your own request",
      });
    }

    // Find matching donors
    const matchingDonors = await DonorProfile.find({
      bloodGroup: bloodRequest.bloodGroup,
      city: bloodRequest.city,
      isAvailable: true,
    }).populate("user", "name email gender");

    res.status(200).json({
      count: matchingDonors.length,
      matchingDonors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};