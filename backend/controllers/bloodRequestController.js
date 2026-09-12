import BloodRequest from "../models/BloodRequest.js";
import DonorProfile from "../models/DonorProfile.js";
import BloodRequestResponse from "../models/BloodRequestResponse.js";

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
        isVerified: true,
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


//requester to see who accepted and declined the requet
export const getBloodRequestResponses = async (req, res) => {
  try {
    const { requestId } = req.params;

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    if (bloodRequest.requester.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only view responses for your own request",
      });
    }

    const responses = await BloodRequestResponse.find({
      bloodRequest: requestId,
    })
      .populate("donor", "name email gender")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: responses.length,
      responses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to update or edit the blood request
export const updateBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    if (bloodRequest.requester.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own blood request",
      });
    }

    if (bloodRequest.status !== "open") {
      return res.status(400).json({
        message: "Only open blood requests can be updated",
      });
    }

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

    if (patientName !== undefined) {
      bloodRequest.patientName = patientName;
    }

    if (bloodGroup !== undefined) {
      bloodRequest.bloodGroup = bloodGroup;
    }

    if (unitsRequired !== undefined) {
      bloodRequest.unitsRequired = unitsRequired;
    }

    if (hospital !== undefined) {
      bloodRequest.hospital = hospital;
    }

    if (city !== undefined) {
      bloodRequest.city = city;
    }

    if (urgency !== undefined) {
      bloodRequest.urgency = urgency;
    }

    if (requiredBy !== undefined) {
      bloodRequest.requiredBy = requiredBy;
    }

    if (contactPhone !== undefined) {
      bloodRequest.contactPhone = contactPhone;
    }

    await bloodRequest.save();

    res.status(200).json({
      message: "Blood request updated successfully",
      bloodRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to cancel the blood request
export const cancelBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    if (bloodRequest.requester.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only cancel your own blood request",
      });
    }

    if (bloodRequest.status !== "open") {
      return res.status(400).json({
        message: "Only open blood requests can be cancelled",
      });
    }

    bloodRequest.status = "cancelled";

    await bloodRequest.save();

    res.status(200).json({
      message: "Blood request cancelled successfully",
      bloodRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};