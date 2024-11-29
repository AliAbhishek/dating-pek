import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: {
    type: Number,
    default: null,
    description:
      "1=No Real Connections , 2=Feeling Overwhelmed, 3=Bad Experiences, 4=Focusing on Themselves, 5=Found Someone ",
  },
  description: { type: String, default: null },
  reportBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
},{timestamps:true});

const Report = mongoose.model("report", reportSchema);

export default Report;
