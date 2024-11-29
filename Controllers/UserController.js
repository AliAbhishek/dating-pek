import { errorRes } from "../Helpers/response.js";
import userServices from "../Services/UserServices.js";

const userController = {
  registration: async (req, res) => {
    try {
      const data = await userServices.registration(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const data = await userServices.verifyOtp(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },

  resendOtp: async (req, res) => {
    try {
      const data = await userServices.resendOtp(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  login: async (req, res) => {
    try {
      const data = await userServices.login(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const data = await userServices.forgetPassword(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const data = await userServices.resetPassword(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  changePassword: async (req, res) => {
    try {
      const data = await userServices.changePassword(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  editProfile: async (req, res) => {
    try {
   
      const data = await userServices.editProfile(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const data = await userServices.deleteUser(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  logout: async (req, res) => {
    try {
      const data = await userServices.logout(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  deleteImage: async (req, res) => {
    try {
  
      const data = await userServices.deleteImage(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const data = await userServices.getUserProfile(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  verifyEmail: async (req, res) => {
    try {
      const data = await userServices.emailVerify(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  phoneOtpVerify: async (req, res) => {
    try {
      const data = await userServices.phoneOtpVerify(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  userListing: async (req, res) => {
    try {
      const data = await userServices.userListing(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  likeDislike: async (req, res) => {
    try {
      const data = await userServices.likeDislike(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  report: async (req, res) => {
    try {
      const data = await userServices.report(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  matchList: async (req, res) => {
    try {
      const data = await userServices.matchList(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  superLikeList: async (req, res) => {
    try {
      const data = await userServices.superLikeList(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
  likeList: async (req, res) => {
    try {
      const data = await userServices.likeList(req, res);
    } catch (error) {
      errorRes(res, 500, error.message);
    }
  },
}

export default userController;
