import express from "express"
import userAuthentication from "../middlewares/UserAuthentication.js"
import chatController from "../Controllers/chatController.js";

const chatRouter = express.Router()

chatRouter.use(userAuthentication)

// ========================================accesschat=======================================

chatRouter.post("/accessChat", chatController.accessChat);

// =======================================fetchChat=========================================

chatRouter.get("/fetchChat", chatController.fetchChat);

// =======================================deleteChat========================================

chatRouter.delete("/deleteChat/:chat", chatController.deleteChat)

export default chatRouter   