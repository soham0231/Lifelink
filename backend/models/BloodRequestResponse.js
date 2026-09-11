import mongoose from "mongoose";

const bloodRequestResponseSchema = new mongoose.Schema(
  {
    bloodRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    response: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bloodRequestResponseSchema.index(
  { bloodRequest: 1, donor: 1 },
  { unique: true }
);

const BloodRequestResponse = mongoose.model(
  "BloodRequestResponse",
  bloodRequestResponseSchema
);

export default BloodRequestResponse;