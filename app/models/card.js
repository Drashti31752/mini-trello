import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
    },
    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.models.Card || mongoose.model("Card", cardSchema);
