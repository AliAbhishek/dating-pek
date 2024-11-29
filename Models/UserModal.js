import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: Number, default: null },
    phoneotp: { type: Number, default: null },
    countryCode: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    dob: { type: String, default: null },
    age: { type: Number, default: null },
    height: { type: Number, default: null },
    gender: {
      type: Number,
      default: null,
      description: "1-male;2-female;3-other",
    },
    preference: {
      type: Number,
      default: null,
      description: "1-men;2-women;3-everyone",
    },
    lookingFor: {
      type: Number,
      default: null,
      description:
        "1-relationship;2-something casual;3-not sure,4-prefer not to say",
    },
    occupation: {
      type: Number,
      default: null,
      description: "1-Student,2-Unemployed,3-Employed,4-Self Employed",
    },
    designation: { type: String, default: null },
    highestQualification: {
      type: Number,
      default: null,
      description:
        "1-High School,2-Undergraduate,3-Graduate,4-Postgraduate,5-Doctorate",
    },
    interest: { type: Array, default: null },
    images: { type: Array, default: null },
    coverImage: { type: String, default: null },
    about: { type: String, default: null },
    subscriptionPlan: { type: String, default: null },
    totalPeeks: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ["Point", "Coordinates"],
        default: "Point",
      },
      coordinates: { type: [Number], default: [0.0, 0.0] },
    },
    device_type: {
      type: Number,
      default: 3,
      description: "0:Web; 1:Android; 2:iOS; 3:default",
    },
    device_token: { type: String, default: null },
    device_model: {
      type: String,
      default: null,
      description: "OS-browser name for web; DEVICE-model for mobile apps",
    },
    isProfileCompleted: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: "0=>incomplete,1=>complete",
    },
    isOnline: { type: Boolean, default: false },
    isEmailVerified: {
      type: Number,
      default: 0,
      description: "0=>unverified,1=>verified",
    },
    isphoneNumberVerified: {
      type: Number,
      default: 0,
      description: "0=>unverified,1=>verified",
    },
    isActive: {
      type: Number,
      default: 1,
      enum: [0, 1],
      description: " 0: Inactive; 1: Active",
    },
    isDeleted: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: " 0: not Deleted; 1: Deleted",
    },
    isAdminDeleted: {
      type: Number,
      default: 0,
      enum: [0, 1],
      description: " 0: not Deleted; 1: Deleted",
    },
    socialId: {
      type: String,
      default: null,
    },
    socialPlatform: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
