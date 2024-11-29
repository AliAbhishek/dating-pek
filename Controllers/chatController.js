import chatServices from "../Services/chatServices.js";


const chatController = {
  accessChat: async (req, res) => {
    try {
      const data = await chatServices.accessChat(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  fetchChat: async (req, res) => {
    try {
      const data = await chatServices.fetchChat(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
  deleteChat: async (req, res) => {
    try {
      const data = await chatServices.deleteChat(req, res);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },
};

export default chatController
