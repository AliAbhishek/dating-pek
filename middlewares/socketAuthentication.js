import jwt from "jsonwebtoken";
import { errorRes } from "../Helpers/response.js";
import User from "../Models/UserModal.js";

const socketAuthentication = async (socket, next) => {
  // console.log("socket.request.headers", socket.request.headers);
  let token = socket.request.headers.authorization;

  if (!token) {
    throw new Error("SocketAuthorization header is missing");
  }

  const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decodeToken, "decode");
    const userId = decodeToken.userId;
  // console.log(userId,"userId")rs

 let user= await User.findByIdAndUpdate(userId,{$set:{isOnline:true}},{new:true})
 console.log(user,"user")

 socket.user = user


  next();
};

export default socketAuthentication;
