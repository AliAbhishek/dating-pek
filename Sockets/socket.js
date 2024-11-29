import { errorRes } from "../Helpers/response.js";
import socketAuthentication from "../middlewares/socketAuthentication.js";
import User from "../Models/UserModal.js";

const socket = (io) => {
  io.use(socketAuthentication);
  io.on("connection", (socket) => {
    console.log(`socket is connected with ${socket?.id}`);
    

    socket.on("joinChat", (chat) => {
      socket.join(chat);
      console.log(`Socket ${socket.id} joined chat: ${chat}`);
    });

    socket.on("sendMessage", ({ chat, content }) => {
      console.log("send");
      socket.to(chat).emit("receiveMessage", { message: "hit" });
      console.log("listen");
    });

    socket.on("disconnect", async () => {
      let userData = socket.user;
      await User.findByIdAndUpdate(
        userData?._id,
        {
          $set: { isOnline: false },
        },
        { new: true }
      );

      console.log(`socket is disconnected with ${socket?.id}`);
    });
  });
};

export default socket;
