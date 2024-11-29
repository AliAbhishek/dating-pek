import jwt from "jsonwebtoken";
import "dotenv/config";
import { errorRes } from "../Helpers/response.js";



function verifyResetToken(req, res, next) {
  const token = req.body.token;
//   console.log(token,"token")
  const secretKey = process.env.JWT_SECRET;
//   console.log(secretKey,"secret")

  jwt.verify(token, secretKey, (err, decoded) => {
    // console.log(decoded,"decode")
    if (err) {
      console.log(err);
      return errorRes(res, 400, "The reset link is invalid or has expired.");
    }
    // console.log(decoded.email,"decoded.email")
    req.admin = decoded.userId;
    next();
  });
}
export default verifyResetToken;
