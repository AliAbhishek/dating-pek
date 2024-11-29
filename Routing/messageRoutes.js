import express from "express"
import userAuthentication from "../middlewares/UserAuthentication.js"
import messageControler from "../Controllers/messageController.js";
import multer from "multer";
import { upload } from "../middlewares/multer.js";


const messageRouter = express.Router()

messageRouter.use(userAuthentication)

// ========================================accesschat=======================================

messageRouter.post("/sendMessage", messageControler.sendMessage);

// ========================================getAllMessage===================================

messageRouter.get("/getAllMessage/:chat", messageControler.getAllMessage);

// ========================================getGiftsList===================================

messageRouter.get("/getGiftsList", messageControler.getGiftsList);

// ========================================addGift===================================

messageRouter.post("/addGifts",upload.fields([{name:"image",maxCount:1}]) ,messageControler.addGifts);

// ========================================getVoucherList===================================

messageRouter.get("/getVoucherList", messageControler.getVoucherList);





export default messageRouter   