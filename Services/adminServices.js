import bcrypt from "bcrypt";
import Users from "../Models/UserModal.js";
import Admin from "../Models/admin.js";
import generateToken from "../Helpers/generateToken.js";
import { errorRes, successRes } from "../Helpers/response.js";
import { sendadminForgetPasswordEmail } from "../Helpers/sendAdminForgetPassword.js";
import User from "../Models/UserModal.js";
import Vouchers from "../Models/vouchers.js";

export const adminServices = {
  // =============================================ADMIN LOGIN===================================================

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });

      if (admin) {
        let checkpassword = await bcrypt.compare(password, admin.password);
        if (!checkpassword) {
          return errorRes(res, 400, "Invalid credentials");
        }

        let token = await generateToken(admin);
        let data = { admin, token };

        successRes(res, 200, "Admin login successfully", data);
      } else {
        return errorRes(res, 400, "Admin not found");
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  //====================================================FORGOT PASSWORD============================================

  forgotpassword: async (req, res) => {
    try {
      //find the user exists in the database or not
      const admin = await Admin.findOne({
        email: req.body.email.toLowerCase(),
      });

      if (!admin) {
        return errorRes(res, 404, "Admin Not Found");
      }
      const token = await generateToken(admin);
      sendadminForgetPasswordEmail({
        email: admin.email,
        project_name: process.env.PROJECT_NAME,
        type: "adminforgetpassword",
        user: admin,
        token: token,
      });
      return successRes(
        res,
        200,
        "Password Reset link has been sent to your provided email"
      );
    } catch (err) {
      return errorRes(res, 500, err.message);
    }
  },
  // ==========================================VERIFY OTP===============================================

  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin) return response.errorRes(res, 400, "Admin not found");

      if (otp == admin.otp) {
        return successRes(res, 200, "otp verified successfully", {
          Admin: admin,
        });
      } else return response.errorRes(res, 400, "Otp is incorrect");
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  //==============================================reset password===============================================

  resetPassword: async (req, res) => {
    try {
      const adminId = req.admin;
      const adminData = await Admin.findById(adminId);
      console.log(adminData, "adminData");

      const email = adminData?.email?.toLowerCase();

      if (!email) {
        return errorRes(res, 404, "Invalid Email");
      }

      const password = req.body.password;

      if (!password) {
        return errorRes(res, 400, "New Password is Required");
      }

      // Fetch user by email
      const admin = await Admin.findOne({ email: email });
      if (!admin) {
        return errorRes(res, 400, "Admin not found");
      }
      const isPasswordSame = await bcrypt.compare(password, admin.password);
      if (isPasswordSame) {
        return errorRes(
          res,
          400,
          "Old Password and New Password should not be the same"
        );
      }
      // Hash the new password
      // const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password and timestamp
      const updatedUser = await Admin.findByIdAndUpdate(
        admin._id, // Assuming MongoDB's default '_id' field
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return errorRes(res, 400, "Invalid or expired token");
      }

      // Send success response
      return successRes(res, 200, "Password Changed Successfully", updatedUser);
    } catch (err) {
      // Handle errors
      return errorRes(res, 500, err.message);
    }
  },

  // ==========================================change password=================================================

  changepassword: async (req, res) => {
    try {
      const adminId = req.admin;
      const { oldPassword, newPassword } = req.body;

      const admin = await Admin.findById(adminId);

      if (!admin) {
        return errorRes(res, 400, "Admin not found");
      }

      let checkPrevPass = await bcrypt.compare(oldPassword, admin.password);

      if (!checkPrevPass) {
        return errorRes(res, 400, "Previous password is incorrect");
      } else {
        let password = await bcrypt.hash(newPassword, 10);
        const admin = await Admin.findOneAndUpdate({
          $set: { password: password },
        });
        return successRes(res, 200, "Password changed successfully", {
          Admin: admin,
        });
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // =================================================user management===============================================

  userManagement: async (req, res) => {
    try {
      let { type, page = 1, limit, search } = req.query;

      // if (!limit) {
      //   defaultlimit = 10;
      // }

      let query = {};
      query.isEmailVerified = 1;
      query.isDeleted = 0;
      query.isAdminDeleted = 0;

      if (type == 0) {
        query.isActive = 0;
      } else if (type == 1) {
        query.isActive = 1;
      }

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      const totalCount = await User.countDocuments(query);
      if (!limit) {
        limit = totalCount;
      }

      limit = parseInt(limit, 10);
      page = parseInt(page, 10);

      console.log(query, "query");

      const userData = await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalPages = Math.ceil(totalCount / (limit ? limit : defaultlimit));

      return successRes(res, 200, "Users fetched successfully", {
        users: userData,
        totalCount,
        limit: limit ? limit : defaultlimit,
        currentpage: page ? page : defaultpage,
        totalPages,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ==========================================get single user=========================================

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);

      const userData = await Users.findById(id);

      if (!userData) {
        return errorRes(res, 400, "User not found");
      }

      return successRes(res, 200, "User fetched successfully", {
        user: userData,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ============================================delete user============================================

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedUser = await Users.findByIdAndUpdate(
        { _id: id },
        { $set: { isAdminDeleted: 1 } },
        { new: true }
      );

      return successRes(res, 200, "User deleted successfully", {
        user: deletedUser,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ==========================================BanUnban user=================================================

  banUnbanUser: async (req, res) => {
    try {
      const { userId, type } = req.body;
      const userData = await Users.findOneAndUpdate(
        { _id: userId },
        { $set: { isActive: type } },
        { new: true }
      );
      if (!userData) {
        return errorRes(res, 404, "User Not Found");
      }
      let message =
        type == 0 ? "User Banned Successfully" : "User Unbanned Successfully";
      return successRes(res, 200, message, userData);
    } catch (err) {
      console.error(err);
      return errorRes(res, 500, err.message);
    }
  },

  // =========================================edit adminProfile============================================

  editAdminProfile: async (req, res) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        phone_number,
        country_code,
      } = req.body;
      const { profile_image } = req.files;

      let image;
      console.log(profile_image, "profileImage");
      if (req.files && req.files.profile_image) {
        image = profile_image[0]?.path;
      }
      console.log(image, "image");

      let adminId = req.admin?._id;
      let adminData = await Admin.findByIdAndUpdate(adminId, {
        $set: {
          first_name,
          last_name,
          email,
          password,
          profile_image: image,
          phone_number,
          country_code,
        },
      });

      return successRes(
        res,
        200,
        "Admin profile edited successfully",
        adminData
      );
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ==========================================getadminbyId===============================================

  getAdminById: async (req, res) => {
    try {
      let adminId = req.admin?._id;

      const userData = await Admin.findById(adminId);

      if (!userData) {
        return errorRes(res, 400, "Admin not found");
      }

      return successRes(res, 200, "Admin fetched successfully", {
        user: userData,
      });
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  getVoucherList: async (req, res) => {
    try {
      let gifts = await Vouchers.find();
      return successRes(res, 200, "Vouchers fetched successfully", gifts);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  addVouchers: async (req, res) => {
    try {
      const {
        description,
        peek,
        discountPercentage,
        expirationDate,
        usageLimit = 1,
        discountCode,
      } = req.body;

      let data = {
        peek,
        description,
        discountPercentage,
        usageLimit,
        expirationDate,
        discountCode,
      };

      let gift = await Vouchers.create(data);
      if (gift) {
        return successRes(res, 200, "Voucher created successfully", gift);
      } else {
        return errorRes(res, 400, "Error in Voucher creation");
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  deleteVoucher: async (req, res) => {
    try {
      const { id } = req.params;

      let vouchers = await Vouchers.findByIdAndDelete(id);
      return successRes(res, 200, "Vouchers deleted successfully", vouchers);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // ===========================================inactiveVoucher==========================

  inactiveVoucher: async (req, res) => {
    try {
      const { id } = req.params;
      let vouchers = await Vouchers.findByIdAndUpdate(id, {
        $set: { isActive: false, isExpired: false },
      });
      return successRes(res, 200, "Vouchers In-Active successfully", vouchers);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
};
