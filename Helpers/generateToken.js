import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET;
const generateToken = async (user) => {
  try {
    const token = await jwt.sign({ userId: user?._id }, JWT_SECRET_KEY, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    return errorRes(res, 500, error.message);
  }
};

export default generateToken;
