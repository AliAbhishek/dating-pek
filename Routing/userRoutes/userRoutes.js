import express from "express";
import userController from "../../Controllers/UserController.js";
import userAuthentication from "../../middlewares/UserAuthentication.js";
import { upload } from "../../middlewares/multer.js";

const userroutes = express.Router();

// ===========================registration===================================

userroutes.post("/registration", userController.registration);
userroutes.post("/verifyOtp", userController.verifyOtp);
userroutes.post("/resendOtp", userController.resendOtp);

// ==============================login=========================================

userroutes.post("/login", userController.login);

// ============================forgetpassword==================================

userroutes.post("/forgetPassword", userController.forgetPassword);
userroutes.post("/resetPassword", userController.resetPassword);

userroutes.use(userAuthentication);
userroutes.post("/changePassword", userController.changePassword);

// ================================create and edit profile==========================

userroutes.put(
  "/editProfile",
  upload.fields([{ name: "images", maxCount: 5 }]),
  userController.editProfile
);

// =============================delete user=======================================

userroutes.put("/deleteUser", userController.deleteUser);

//===========================logout=============================================

userroutes.put("/logout", userController.logout);

//===========================deleteImage=============================================

userroutes.delete("/deleteImage", userController.deleteImage);

// =====================================getUserProfile===================================

userroutes.get("/getUserProfile", userController.getUserProfile);

// ====================================emailVerify====================================

userroutes.post("/emailVerify", userController.verifyEmail);
// ====================================phonenumberVerify====================================

userroutes.post("/phoneOtpVerify", userController.phoneOtpVerify);

// ===================================userListing============================================

userroutes.get("/userListing", userController.userListing);

// ===================================likeDislike============================================

userroutes.post("/likeDislike", userController.likeDislike);

// =================================report================================================

userroutes.post("/report", userController.report);

// ================================matchList============================================

userroutes.get("/matchList", userController.matchList);

// ================================superLikeList============================================

userroutes.get("/superLikeList", userController.superLikeList);

// ================================LikeList============================================

userroutes.get("/likeList", userController.likeList);



export default userroutes;
