import BloodRequest from "../models/BloodRequest.js";
import BloodRequestResponse from "../models/BloodRequestResponse.js";

export const respondToBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { response } = req.body;

    // 1. Validate response
    if (!["accepted", "declined"].includes(response)) {
      return res.status(400).json({
        message: "Response must be accepted or declined",
      });
    }

    // 2. Check if blood request exists
    const bloodRequest = await BloodRequest.findById(requestId);

    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    // 3. Check request status
    if (bloodRequest.status !== "open") {
      return res.status(400).json({
        message: "This blood request is no longer open",
      });
    }

    // 4. Find existing donor response
    let donorResponse = await BloodRequestResponse.findOne({
      bloodRequest: requestId,
      donor: req.user.userId,
    });

    // 5. Create response if it doesn't exist
    if (!donorResponse) {
      donorResponse = await BloodRequestResponse.create({
        bloodRequest: requestId,
        donor: req.user.userId,
        response,
        respondedAt: new Date(),
      });
    } else {
      // Update existing response
      donorResponse.response = response;
      donorResponse.respondedAt = new Date();

      await donorResponse.save();
    }

    res.status(200).json({
      message: `Request ${response} successfully`,
      donorResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};