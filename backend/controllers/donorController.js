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

//to update the donor profile
export const updateDonorProfile = async (req, res) => {
  try {
    const {
      bloodGroup,
      phone,
      city,
      isAvailable,
      lastDonationDate,
    } = req.body;

    const donorProfile = await DonorProfile.findOne({
      user: req.user.userId,
    });

    if (!donorProfile) {
      return res.status(404).json({
        message: "Donor profile not found",
      });
    }

    if (bloodGroup !== undefined) {
      donorProfile.bloodGroup = bloodGroup;
    }

    if (phone !== undefined) {
      donorProfile.phone = phone;
    }

    if (city !== undefined) {
      donorProfile.city = city;
    }

    if (isAvailable !== undefined) {
      donorProfile.isAvailable = isAvailable;
    }

    if (lastDonationDate !== undefined) {
      donorProfile.lastDonationDate = lastDonationDate;
    }

    await donorProfile.save();

    res.status(200).json({
      message: "Donor profile updated successfully",
      donorProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//to get the donor profile
export const getDonorProfile = async (req, res) => {
  try {
    const donorProfile = await DonorProfile.findOne({
      user: req.user.userId,
    }).populate("user", "name email gender");

    if (!donorProfile) {
      return res.status(404).json({
        message: "Donor profile not found",
      });
    }

    res.status(200).json({
      donorProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};