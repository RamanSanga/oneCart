import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.models.lead || mongoose.model("lead", leadSchema);

export default Lead;
