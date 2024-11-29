import { errorRes } from "../Helpers/response.js";
import jwt from "jsonwebtoken";
import User from "../Models/UserModal.js";

const userAuthentication = async (req, res, next) => {
  try {
    // console.log(" req.headers.authorization ", req.headers.authorization);
    let token = req.headers.authorization;
    console.log( req.headers, " req.headers.");
    
 


    if (!token) {
      throw new Error("Authorization header is missing");
    }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodeToken, "decode");
    const userId = decodeToken.userId;
    // console.log(userId,"userId")rs

  

    let userFromDb = await User.findById(userId);
    // console.log(userFromDb, "user");

    req.user = userFromDb;
    if (!userFromDb.isActive) {
      return errorRes(res, 400, "Admin has suspended Your Account");
    }
    if (userFromDb.isAdminDeleted) {
      return errorRes(res, 400, "Your Account has been Deleted By Admin");
    }
    if (userFromDb.isDeleted) {
      return errorRes(res, 400, "User Not Found");
    }
    next();
  } catch (error) {
    return errorRes(res, 401, "Unauthorised");
  }
};

export default userAuthentication;
