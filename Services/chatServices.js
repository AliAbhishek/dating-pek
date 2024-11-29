import { errorRes, successRes } from "../Helpers/response.js";
import Chat from "../Models/chatModel.js";

const chatServices = {

  accessChat: async (req, res) => {
    try {
      const { chatWithUser } = req.body;
      const userId = req.user._id;

      if (!chatWithUser) {
        return errorRes(res, 400, "Please give id");
      }

      // check existing chat room

      let existChatroom = await Chat.findOne({
        $and: [
          { users: { $elemMatch: { $eq: chatWithUser } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      }).populate("users");

      console.log(existChatroom, "existChatroom");

      if (existChatroom) {
        return successRes(res, 200, "Chat Found", existChatroom);
      } else {
        let chatData = {
          users: [userId, chatWithUser],
        };

        try {
          let chat = await Chat.create(chatData);
          let fullchat = await Chat.findOne({ _id: chat?._id }).populate("users")
          return successRes(res, 201, "Chat created successfully", fullchat);
        } catch (error) {
          return errorRes(res, 400, "Error in found chat");
        }
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  fetchChat:async(req,res)=>{
    try {
        const userId = req.user._id;
        let data = await Chat.find({users:{$elemMatch:{$eq:userId}}}).populate(["users","latestMessage"]).sort({ updatedAt: -1 })

        if (!data) {
            return errorRes(res, 400, "Chats can not fetched successfully")


        } else {
            return successRes(res, 201, "Chats fetched successfully",data)
        }
        
    } catch (error) {
        return errorRes(res, 500, error.message);
    }
  },
  deleteChat:async(req,res)=>{
    try {
      const {chat} = req.params
      if(!chat){
        return errorRes(res,400,"PLease give chat Id")
      }

      await Chat.deleteById(chat)
      return successRes(res,200,"Chat deleted successfully")
      
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  }


};

export default chatServices;
