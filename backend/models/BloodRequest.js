import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      required: true,
    },

    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },

    hospital: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["normal", "urgent", "critical"],
      default: "normal",
    },

    requiredBy: {
      type: Date,
      required: true,
    },

    contactPhone: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "fulfilled", "cancelled"],
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

const BloodRequest = mongoose.model(
  "BloodRequest",
  bloodRequestSchema
);

export default BloodRequest;