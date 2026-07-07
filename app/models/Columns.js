import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.Column || mongoose.model("Column", columnSchema);
