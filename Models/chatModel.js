import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    unreadCountMesaages: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
