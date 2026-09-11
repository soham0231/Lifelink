import DonorProfile from "../models/DonorProfile.js";


export const createDonorProfile = async (req, res) => {
  try {
    const {
      bloodGroup,
      phone,
      city,
      isAvailable,
      lastDonationDate,
    } = req.body;

    if (!bloodGroup || !phone || !city) {
      return res.status(400).json({
        message: "Blood group, phone and city are required",
      });
    }

    const existingProfile = await DonorProfile.findOne({
      user: req.user.userId,
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Donor profile already exists",
      });
    }

    const donorProfile = await DonorProfile.create({
      user: req.user.userId,
      bloodGroup,
      phone,
      city,
      isAvailable,
      lastDonationDate,
    });

    res.status(201).json({
      message: "Donor profile created successfully",
      donorProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};