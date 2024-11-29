import generateToken from "../Helpers/generateToken.js";
import { errorRes, successRes } from "../Helpers/response.js";
import sendEmail from "../Helpers/sendEmail.js";
import User from "../Models/UserModal.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import LikeDislike from "../Models/likeDislike.js";
import Report from "../Models/reportModal.js";
import moment from "moment";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userServices = {
  //==========================================REGISTRATION==============================================

  registration: async (req, res) => {
    try {
      let {
        name,
        email,
        countryCode,
        phoneNumber,
        password,
        device_token,
        device_type,
        device_model,
      } = req.body;

      // check for existing email
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        if (existEmail?.isEmailVerified == 0) {
          let otp = Math.floor(1000 + Math.random() * 9000);
          existEmail.otp = otp;
          await existEmail.save();
          sendEmail({
            otp,
            email: existEmail.email,
            project_name: process.env.PROJECT_NAME,
            type: "verifyOtp",
            user: existEmail,
          });
          return successRes(
            res,
            200,
            "Otp sent to your email,Please verify your email",
            existEmail
          );
        } else {
          return errorRes(res, 400, "Email already exist");
        }
      }

      // store email and password

      let hashedPassword = await bcrypt.hash(password, 10);

      let otp = Math.floor(1000 + Math.random() * 9000);

      let registeredUser = {
        email,
        password: hashedPassword,
        otp,
        name,
        countryCode,
        phoneNumber,
        device_token,
        device_type,
        device_model,
      };

      let registerdUserData = await User.create(registeredUser);
      sendEmail({
        otp,
        email: registerdUserData.email,
        project_name: process.env.PROJECT_NAME,
        type: "verifyOtp",
        user: registerdUserData,
      });
      return successRes(
        res,
        200,
        "Otp sent to your email,Please verify your email",
        registerdUserData
      );
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },

  //==========================================VERIFY OTP================================================
  verifyOtp: async (req, res) => {
    try {
      let { type = 0, userId, otp } = req.body;
      if (userId) {
        let userData = await User.findById(userId);
        if (!userData) {
          return errorRes(res, 400, "User did not exist");
        }
        if (type == 1) {
          // console.log(userData?.phoneotp,"userData?.phoneotp")
          if (userData?.phoneotp == otp) {
            userData.isphoneNumberVerified = 1;
            let updatedData = await userData.save();
            // let data = {
            //   updatedData,
            //   token,
            // };
            return successRes(
              res,
              200,
              "OTP verified successfully",
              updatedData
            );
          } else {
            return errorRes(res, 400, "Incorrect OTP");
          }
        } else {
          if (userData?.otp === otp) {
            userData.isEmailVerified = 1;
            let token = await generateToken(userData);
            let updatedData = await userData.save();
            let data = {
              updatedData,
              token,
            };
            return successRes(res, 200, "OTP verified successfully", data);
          } else {
            return errorRes(res, 400, "Incorrect OTP");
          }
        }
      } else {
        return errorRes(res, 400, "Please provide user Id");
      }
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },

  //==========================================RESEDND OTP================================================

  resendOtp: async (req, res) => {
    try {
      const { type = 0, email, userId } = req.body;
      if (userId) {
        let userData = await User.findById(userId);
        if (!userData) {
          return errorRes(res, 400, "User did not exist");
        }
        // create new otp
        const otp = Math.floor(1000 + Math.random() * 9000);
        type == 1 ? (userData.phoneotp = otp) : (userData.otp = otp);
        let updateduser = await userData.save();

        // sendemail

        sendEmail({
          otp,
          email: email ? email : updateduser.email,
          project_name: process.env.PROJECT_NAME,
          type: "resendOTP",
          user: updateduser,
        });
        let token = await generateToken(userData?._id);

        let data = {
          updateduser,
          token,
        };

        return successRes(
          res,
          200,
          "OTP has been resent to your provided email",
          data
        );
      } else {
        return errorRes(res, 400, "Please provide user Id");
      }
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },

  //   ========================================login=====================================================

  login: async (req, res) => {
    try {
      const { email, password, device_token, device_type, device_model } =
        req.body;
      let userFromDb = await User.findOne({ email });
      console.log(userFromDb, "userfromdb");

      if (!userFromDb) {
        return errorRes(res, 400, "User did not exist");
      }
      if (!userFromDb.isActive) {
        return errorRes(res, 400, "Admin has suspended Your Account");
      }
      if (userFromDb.isAdminDeleted) {
        return errorRes(res, 400, "Your Account has been Deleted By Admin");
      }
      if (userFromDb.isDeleted) {
        return errorRes(res, 400, "User Not Found");
      }

      // Check if the user is verified and active
      if (!userFromDb.isEmailVerified) {
        const otp = Math.floor(1000 + Math.random() * 9000);

        userFromDb.otp = otp;
        let updatedUser = await userFromDb.save();
        sendEmail({
          otp,
          email: userFromDb.email,
          project_name: process.env.PROJECT_NAME,
          type: "verifyOtp",
          user: userFromDb,
        });

        return successRes(res, 200, "Please Verify Your Account", updatedUser);
      }

      // match password

      let decodePassword = await bcrypt.compare(password, userFromDb.password);
      if (!decodePassword) {
        return errorRes(res, 400, "Invalid Password");
      }

      // Generate JWT token

      let token = await generateToken(userFromDb);
      // Update device information
      userFromDb.device_token = device_token ? device_token : null;
      userFromDb.device_model = device_model ? device_model : null;
      userFromDb.device_type = device_type ? device_type : null;
      let updatedUser = await userFromDb.save();

      let data = { updatedUser, token };

      return successRes(res, 200, "User successfully login", data);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },

  //==========================================FORDOT PASSWORD============================================

  forgetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      let user = await User.findOne({ email });

      if (!user) {
        return errorRes(res, 400, "Please enter a valid email");
      }
      const otp = Math.floor(1000 + Math.random() * 9000);

      user.otp = otp;
      let updatedUser = await user.save();
      sendEmail({
        otp,
        email: updatedUser.email,
        project_name: process.env.PROJECT_NAME,
        type: "forgotPassword",
        user: updatedUser,
      });

      return successRes(
        res,
        200,
        "OTP has been sent to your provided email",
        updatedUser
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ================================================RESET PASSWORD======================================

  resetPassword: async (req, res) => {
    try {
      const { userId, password } = req.body;
      let user = await User.findById(userId);
      if (!user) {
        return errorRes(res, 404, "User not found");
      }

      let checkPrevPass = await bcrypt.compare(password, user?.password);

      if (checkPrevPass) {
        return errorRes(
          res,
          400,
          "Password must be different from previous one"
        );
      }

      let hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { password: hashedPassword } },
        { new: true }
      );

      return successRes(res, 200, "Password reset successfully", {
        data: updatedUser,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ===============================================change password=======================================

  changePassword: async (req, res) => {
    try {
      const userId = req.user._id;

      const { oldpassword, newpassword } = req.body;
      let user = await User.findById(userId);
      if (!user) {
        return errorRes(res, 404, "User not found");
      }

      let checkPrevPass = await bcrypt.compare(oldpassword, user?.password);

      if (!checkPrevPass) {
        return errorRes(res, 400, "Old password is incorrect");
      }

      if (oldpassword == newpassword) {
        return errorRes(
          res,
          400,
          "Old password and new password does not be same"
        );
      }

      let hashedPassword = await bcrypt.hash(newpassword, 10);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { password: hashedPassword } },
        { new: true }
      );

      return successRes(res, 200, "Password changed successfully", {
        data: updatedUser,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ============================================edit profile=============================================

  editProfile: async (req, res) => {
    try {
      const {
        gender,
        dob,
        height,
        preference,
        lookingFor,
        occupation,
        designation,
        highestQualification,
        about,
        lat,
        lan,
        interest,
        coverImage,
        name,
        phoneNumber,
        email,
      } = req.body;

      console.log(req.files.images, "images");
      console.log(
        gender,
        dob,
        height,
        preference,
        lookingFor,
        occupation,
        designation,
        highestQualification,
        about,
        lat,
        lan,
        interest,
        coverImage,
        "data"
      );

      let imagesArr = [];

      if (req.files && req.files.images) {
        //   profileImage = req.files.profileImage[0].path;
        req.files.images?.forEach((image, i) => imagesArr.push(image?.path));
      }

      const userId = req.user._id;

      let locationCoordinates;

      if (lat && lan) {
        // locationCoordinates = [lat, lan];
        locationCoordinates = {
          type: "Point",
          coordinates: [lan, lat],
        };
      }

      let age;

      if (dob) {
        const birthDate = moment(dob, "DD-MM-YYYY");

        // Check if the birthDate is valid
        if (!birthDate.isValid()) {
          console.error("Invalid birth date:", dob);
          return null; // Return null for invalid date
        }

        // Calculate age using Moment.js
        age = moment().diff(birthDate, "years");
      }

      const userFromDb = await User.findById(userId);

      let updateFields = {
        gender,
        dob,
        height,
        preference,
        lookingFor,
        occupation,
        designation,
        highestQualification,
        about,
        interest,
        location: locationCoordinates,
        isProfileCompleted: 1,
        coverImage,
        name,
        phoneNumber,
        email,
        age: age,
      };

      if (imagesArr.length > 0) {
        updateFields.images = imagesArr; // Only update images if new ones are uploaded
      }

      const user = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: updateFields,
        },
        { new: true }
      );

      if (!user) {
        return errorRes(res, 404, "User Not Found");
      }

      return successRes(
        res,
        200,
        `Profile ${
          userFromDb?.isProfileCompleted == 0 ? "created" : "updated"
        } successfully`,
        user
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // =============================================delete user=================================================

  deleteUser: async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await User.findByIdAndUpdate(userId, {
        $set: {
          isDeleted: 1,
        },
      });
      // const user = await User.findByIdAndUpdate({_id:userId},{$set:{is}});

      return successRes(res, 200, "User deleted Successfully");
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  //============================================logout======================================================

  logout: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { device_token: null } },
        { new: true }
      );
      return successRes(res, 200, "User logout Successfully", user);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ============================================deleteImage====================================================

  deleteImage: async (req, res) => {
    try {
      // console.log(req
      //   ,"request"
      // )
      const { imageName } = req.query;
      //  console.log(imageName,"imagename")
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let urlAfterSlash1 = imageName.split("\\").pop();
      console.log(urlAfterSlash1);

      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        urlAfterSlash1
      );
      console.log(filePath, "filepath"); // Adjust according to your folder structure

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { images: imageName } }, // This removes the imageName from the images array
        { new: true } // Returns the updated document
      );
      // Unlink (delete) the file
      fs.unlink(filePath, (err) => {
        if (err) {
          return console.error("Error deleting file:", err);
        }
        console.log("Image deleted successfully");
      });

      return successRes(res, 200, "Image deleted successfully", updatedUser);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ============================================get UserDetails==============================================

  getUserProfile: async (req, res) => {
    try {
      const userId = req.user._id;
      const userDetails = await User.findById(userId, { password: 0 });
      if (userDetails) {
        return successRes(
          res,
          200,
          "User details fetched successfully",
          userDetails
        );
      } else {
        return errorRes(res, 200, "Something went wrong");
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ==========================================emailverify======================================================

  emailVerify: async (req, res) => {
    try {
      const { email } = req.body;
      const userId = req.user._id;
      const user = await User.findById(userId);
      console.log(user, "user");
      let otp = Math.floor(1000 + Math.random() * 9000);
      user.otp = otp;
      await user.save();
      sendEmail({
        otp,
        email: email,
        project_name: process.env.PROJECT_NAME,
        type: "verifyOtp",
        user: user,
      });
      return successRes(
        res,
        200,
        "Otp sent to your email,Please verify your email",
        user
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ========================================phoneotpcerify=====================================================

  phoneOtpVerify: async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      const userId = req.user._id;
      if (!phoneNumber) {
        return errorRes(res, 200, "Please provide phone number");
      }
      const user = await User.findById(userId);
      let otp = Math.floor(1000 + Math.random() * 9000);
      user.phoneotp = otp;
      await user.save();
      // sendEmail({
      //   otp,
      //   email: user.email,
      //   project_name: process.env.PROJECT_NAME,
      //   type: "verifyOtp",
      //   user: user,
      // });
      return successRes(
        res,
        200,
        "Otp sent to your provided phone number,Please verify your phone number",
        user
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // =============================================userListing===================================================

  userListing: async (req, res) => {
    try {
      const {
        minAge = 0,
        maxAge,
        minHeight = 0,
        maxHeight,
        lookingFor,
        preference,
        interest,
      } = req.query;

      const userId = req.user._id;
      const userDetail = await User.findById(userId);
      let query = { preference: userDetail?.preference };

      if (maxAge) {
        query.age = { $gte: minAge, $lte: maxAge };
      }
      if (maxHeight) {
        query.height = { $gte: minHeight, $lte: maxHeight };
      }
      if (lookingFor) {
        query.lookingFor = lookingFor;
      }
      if (preference) {
        query.preference = preference;
      }
      if (interest) {
        const interestsArray = Array.isArray(interest)
          ? interest
          : interest.split(",");
        query.interest = { $in: interestsArray };
      }

      console.log(query, "query");

      const userList = await User.find(query).lean();

      // Map over userList to calculate compatibility
      const list = userList.map((user) => {
        // Check if lookingFor matches
        if (user.lookingFor !== userDetail.lookingFor) {
          user.compatibility = 0; // No compatibility if lookingFor doesn't match
          return user; // Return user with compatibility set to 0
        }

        // Find common interests
        const commonInterests = user.interest.filter((interest) =>
          userDetail.interest.includes(interest)
        );

        // Calculate compatibility percentage
        const totalInterests = userDetail.interest.length;
        const compatibilityPercentage =
          (commonInterests.length / totalInterests) * 100;

        // Assign compatibility to user object

        user.compatibility = compatibilityPercentage;

        return user;
      });

      return successRes(res, 200, "Users fetched successfully", list);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ==========================================like dislike=================================================

  likeDislike: async (req, res) => {
    try {
      const { likedTo, action } = req.body;

      let likedBy = req.user._id;

      if (action == 1) {
        const existingLike = await LikeDislike.findOne({
          likedTo,
          likedBy,
          action: 1,
        });

        if (existingLike) {
          return errorRes(res, 400, "You have already liked this user.");
        } else {
          const newLike = new LikeDislike({
            likedBy,
            likedTo,
            action: 1,
          });
          await newLike.save();

          // Check for mutual like
          const mutualLike = await LikeDislike.findOne({
            likedTo: likedBy,
            likedBy: likedTo,
            action: 1, // Ensure the action is also a like
          });

          // If mutual like exists, update ismatched for both records
          if (mutualLike) {
            await LikeDislike.updateMany(
              {
                $and: [
                  { likedBy, likedTo },
                  { likedBy: likedTo, likedTo: likedBy },
                ],
              },
              { $set: { ismatched: true } }
            );
          }

          return successRes(res, 200, "User liked successfully.");
        }
      } else if (action == 2) {
        // If the action is 'dislike'
        const existingDislike = await LikeDislike.findOne({
          likedTo,
          likedBy,
          action: 2,
        });

        if (existingDislike) {
          return errorRes(res, 400, "You have already disliked this user.");
        }

        // Create a new dislike entry
        const newDislike = new LikeDislike({
          likedBy,
          likedTo,
          action: 2,
        });
        await newDislike.save();

        // Check if the two users were previously matched
        const mutualLike = await LikeDislike.findOne({
          likedTo: likedBy,
          likedBy: likedTo,
          action: 1, // Ensure it was a like before
          ismatched: true, // Check if they were matched
        });

        // If they were matched, set ismatched to false for both records
        if (mutualLike) {
          await LikeDislike.updateMany(
            {
              $or: [
                { likedBy, likedTo },
                { likedBy: likedTo, likedTo: likedBy },
              ],
            },
            { $set: { ismatched: false } }
          );
        }

        return successRes(res, 200, "User disliked successfully.");
      } else if (action == "3") {
        const existingSuperLike = await LikeDislike.findOne({
          likedTo,
          likedBy,
          action: 3,
        });

        if (existingSuperLike) {
          return errorRes(res, 400, "You have already super liked this user.");
        }

        // Create a new dislike entry
        const newSuperlike = new LikeDislike({
          likedBy,
          likedTo,
          action: 3,
        });
        await newSuperlike.save();
        return successRes(res, 200, "User super liked successfully.");
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // =========================================report user===================================================

  report: async (req, res) => {
    try {
      const { reportUserId, reason, description } = req.body;
      let reportBy = req.user._id;

      let obj = {
        reportUserId,
        reason,
        description,
        reportBy,
      };

      let data = await Report.create(obj);

      return successRes(res, 200, "User reported successfully.", data);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ===========================================match list=====================================================

  matchList: async (req, res) => {
    try {
      let userId = req.user._id;

      let data = await LikeDislike.find({
        $and: [{ likedTo: userId, ismatched: true }],
      });
      return successRes(res, 200, "Matched user fetched successfully.", data);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // =====================================super like listing=================================================
  
  superLikeList: async (req, res) => {
    try {
      let userId = req.user._id;

      let data = await LikeDislike.find({
        $and: [{ likedTo: userId, action: 3 }],
      });
      return successRes(res, 200, "Super Liked user fetched successfully.", data);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ===================================== like listing=================================================
  
  likeList: async (req, res) => {
    try {
      let userId = req.user._id;

      let data = await LikeDislike.find({
        $and: [{ likedTo: userId, action: 1 }],
      });
      return successRes(res, 200, "Liked user fetched successfully.", data);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

};

export default userServices;
