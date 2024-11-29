import mongoose from "mongoose";

const LikeDislikeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: { type: Number, enum: [1,2,3], required: true ,description:"1-like,2-dislike,3-superlike"},
    ismatched:{type:Boolean,default:false},
    
  },
  { timestamps: true }
);

const LikeDislike = mongoose.model("LikeDislike", LikeDislikeSchema);

export default LikeDislike
