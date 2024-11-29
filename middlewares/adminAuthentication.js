import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import Admin from "../Models/admin.js";
import { errorRes } from "../Helpers/response.js";




export const adminauthentication=async(req,res,next)=>{
    
    try {
        const token = req.headers.authorization
        // console.log(token,"tokren")
        if(!token){
            return errorRes(res, 400, "Unauthorise");
        }

        const decodeToken = await jwt.verify(token, process.env.JWT_SECRET)

        const userId = decodeToken.userId;
        const admin = await Admin.findById(userId);
        req.admin = admin;
        next()
        
    } catch (error) {
        return errorRes(res, 500, error.message);
        
    }

 


}