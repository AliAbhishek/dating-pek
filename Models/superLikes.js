import mongoose from "mongoose";

const superLikeSchema = new mongoose.Schema(
    {
        superlikedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        superlikedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        action: { type: Number, enum: [1,2], required: true ,description:"1-like,2-dislike"},
        ismatched:{type:Boolean,default:false}
      
},{timestamps:true});

const SuperLike = mongoose.model("superLike", superLikeSchema);

export default Report;