import BloodRequest from "../models/BloodRequest.js";
import BloodRequestResponse from "../models/BloodRequestResponse.js";

export const respondToBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response } = req.body;

    if (!["accepted", "declined"].includes(response)) {
      return res.status(400).json({
        message: "Response must be accepted or declined",
      });
    }

    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    if (bloodRequest.status !== "open") {
      return res.status(400).json({
        message: "This blood request is no longer open",
      });
    }

    let donorResponse = await BloodRequestResponse.findOne({
      bloodRequest: requestId,
      donor: req.user.userId,
    });

    if (!donorResponse) {
      donorResponse = await BloodRequestResponse.create({
        bloodRequest: requestId,
        donor: req.user.userId,
        response,
        respondedAt: new Date(),
      });
    } else {
      donorResponse.response = response;
      donorResponse.respondedAt = new Date();

      await donorResponse.save();
    }

    // Check how many donors have accepted
    const acceptedResponses = await BloodRequestResponse.countDocuments({
      bloodRequest: requestId,
      response: "accepted",
    });

    // Each accepted donor represents 1 unit in v1
    if (acceptedResponses >= bloodRequest.unitsRequired) {
      bloodRequest.status = "fulfilled";
      await bloodRequest.save();
    }

    res.status(200).json({
      message: `Request ${response} successfully`,
      donorResponse,
      requestStatus: bloodRequest.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};