import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    peek: { type: Number, default: null },
    description: { type: String, default: null },
    discountCode: { type: String, default: null },
    expirationDate: { type: Date },
    usageLimit: { type: Number },
    discountPercentage: { type: Number },
    isExpired: { type: Boolean, default: false },
    isActive:{type:Boolean,default:true}
  },
  { timestamps: true }
);

const Vouchers = mongoose.model("Vouchers", voucherSchema);
export default Vouchers;
