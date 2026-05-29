import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  amount: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    enum: ["save", "use"],
    required: true,
  },

  savings: {
    type: Number,
    default: 0,
  },

  date: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model("Transaction", transactionSchema);