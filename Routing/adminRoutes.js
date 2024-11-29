import express from "express"
import { adminController } from "../Controllers/adminController.js"
import { adminauthentication } from "../middlewares/adminAuthentication.js"
import verifyResetToken from "../middlewares/verifyResetToken.js"
import { upload } from "../middlewares/multer.js"




const adminRouter = express.Router()

// =>Registration flow

adminRouter.post("/login" , adminController.login)
adminRouter.post("/forgetPassword" , adminController.forgotpassword)
adminRouter.post("/verifyOTP" , adminController.verifyOTP)

adminRouter.post("/resetPassword" ,verifyResetToken, adminController.resetPassword)


adminRouter.use(adminauthentication)
adminRouter.post("/changepassword" , adminController.changepassword)
adminRouter.put("/editAdminProfile" ,upload.fields([{name:"profile_image",maxCount:1}]) ,adminController.editAdminProfile)
adminRouter.get("/getAdminById" ,adminController.getAdminById)

// =>UserManagement flow

adminRouter.get("/userManagement" , adminController.userManagement)
adminRouter.get("/getUserById/:id" , adminController.getUserById)
adminRouter.delete("/deleteUser/:id" , adminController.deleteUser)
adminRouter.post("/banUnbanUser" , adminController.banUnbanUser)

// vouchers


adminRouter.get("/getVoucherList", adminController.getVoucherList);
adminRouter.post("/addVouchers" ,adminController.addVouchers);
adminRouter.delete("/deleteVoucher/:id" ,adminController.deleteVoucher);
adminRouter.put("/inactiveVoucher/:id" ,adminController.inactiveVoucher);




export default adminRouter