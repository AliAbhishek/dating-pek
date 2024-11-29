import { errorRes, successRes } from "../Helpers/response.js";
import Chat from "../Models/chatModel.js";
import Gifts from "../Models/gifts.js";
import Message from "../Models/messagesModel.js";
import Transactions from "../Models/transactions.js";
import User from "../Models/UserModal.js";
import Vouchers from "../Models/vouchers.js";

const messageServices = {
  sendMessage: async (req, res) => {
    try {
      const { content, chat, gift, voucher } = req.body;
      const userId = req.user._id;

      let data = {
        content,
        chat,
        sender: userId,
        gift,
        voucher,
      };

      let messageData = await Message.create(data);
      if (messageData) {
        const chatUsers = await Chat.findById(chat).select("users");
        const otherUsers = chatUsers.users.filter(
          (user) => user.toString() !== userId
        );
        const update = {};
        const updateToSee = {};
        otherUsers.forEach((user) => {
          update[`unreadCountMesaages.${user}`] = 1; // Increment for each other user
        });
        otherUsers.forEach((user) => {
          updateToSee[user] = false;
        });

        console.log(update, "update");
        console.log(updateToSee, "updateToSee");

        await Chat.findByIdAndUpdate(
          chat,
          {
            $set: {
              latestMessage: messageData?._id,
              $inc: update,
            },
          },
          { new: true }
        );

        await Message.findByIdAndUpdate(
          messageData?._id,
          {
            $set: {
              isSeen: updateToSee,
            },
          },
          { new: true }
        );

        if (voucher) {
          const voucherDetails = await Vouchers.findById(voucher);
          console.log(voucherDetails, "vd");
          let checkUserPeek = await User.findById(userId, {
            totalPeeks: 1,
            _id: 0,
          });
          if (checkUserPeek?.totalPeeks <= 0) {
            return errorRes(
              res,
              400,
              "You did not have sufficient peeks, Please buy it."
            );
          } else {
            let user = await User.findByIdAndUpdate(userId, {
              $inc: { totalPeeks: -voucherDetails.peek }, // Decrement the totalPeeks
            }, { new: true });
            // await Transactions.create({peek:voucherDetails.peek,name:voucherDetails.description})
            console.log(voucher, "voucher");
          }
        }

        if (gift) {
          const giftDetails = await Gifts.findById(gift);
          console.log(giftDetails, "vd");
          let checkUserPeek = await User.findById(userId, {
            totalPeeks: 1,
            _id: 0,
          });
          if (checkUserPeek?.totalPeeks <= 0) {
            return errorRes(
              res,
              400,
              "You did not have sufficient peeks, Please buy it."
            );
          } else {
            let user = await User.findByIdAndUpdate(userId, {
              $inc: { totalPeeks: -giftDetails.peek }, // Decrement the totalPeeks
            }, { new: true });
            console.log(user, "uuuseerrr");
          }
        }

        messageData = await Message.findById(messageData?._id);

        return successRes(res, 200, "Message send successfully", messageData);
      } else {
        return errorRes(res, 500, "Error in sending message");
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  getAllMessage: async (req, res) => {
    try {
      const { chat } = req.params;
      const userId = req.user._id;

      if (!chat) {
        return errorRes(res, 400, "Please provide chat Id");
      }

      let messages = await Message.find({ chat });
      await Chat.findByIdAndUpdate(
        chat,
        {
          $set: {
            [`unreadCountMesaages.${userId}`]: 0,
          },
        },
        { new: true }
      );
      // Update isSeen status for all users except the sender

      const bulkOps = messages
        .map((message) => {
          // Only prepare an update if the message sender is not the current user
          if (message.sender.toString() !== userId) {
            return {
              updateOne: {
                filter: { _id: message._id },
                update: {
                  $set: {
                    [`isSeen.${userId}`]: true, // Set the current user's seen status to true
                  },
                },
              },
            };
          }
          return null; // Ignore messages sent by the current user
        })
        .filter((op) => op); // Remove null entries

      // Perform bulk write operation if there are updates to be made
      if (bulkOps.length > 0) {
        await Message.bulkWrite(bulkOps);
      }

      messages = await Message.find({ chat }).populate(["gift", "voucher"]);

      return successRes(res, 200, "Messages fetched successfully", messages);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  getGiftsList: async (req, res) => {
    try {
      let gifts = await Gifts.find();
      return successRes(res, 200, "Gifts fetched successfully", gifts);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  addGifts: async (req, res) => {
    try {
      const { peek } = req.body;
      const { image } = req.files;

      console.log(image, "image");
      if (!image) {
        return errorRes(res, 400, "Please provide image");
      }

      let data = {
        peek,
        image: image[0].path,
      };

      let gift = await Gifts.create(data);
      if (gift) {
        return successRes(res, 200, "Gift created successfully", gift);
      } else {
        return errorRes(res, 400, "Error in Gift creation");
      }
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  getVoucherList: async (req, res) => {
    try {
      let gifts = await Vouchers.find();
      return successRes(res, 200, "Vouchers fetched successfully", gifts);
    } catch (error) {
      return errorRes(res, 500, error.message);
    }
  },

  // addVouchers: async (req, res) => {
  //   try {
  //     const {description, peek,discountPercentage,expirationDate, usageLimit = 1,discountCode } = req.body;

  //     let data = {
  //       peek,
  //       description,
  //       discountPercentage,
  //       usageLimit,
  //       expirationDate,
  //       discountCode
  //     };

  //     let gift = await Vouchers.create(data);
  //     if (gift) {
  //       return successRes(res, 200, "Voucher created successfully", gift);
  //     }else{
  //       return errorRes(res, 400, "Error in Voucher creation");
  //     }
  //   } catch (error) {
  //     return errorRes(res, 500, error.message);
  //   }
  // },

  // deleteVoucher:async(req,res)=>{
  //   try {
  //     const {id} = req.params

  //     let gifts = await Vouchers.findByIdAndDelete(id);
  //     return successRes(res, 200, "Vouchers deleted successfully", gifts);

  //   } catch (error) {
  //     return errorRes(res, 500, error.message);
  //   }
  // }
};

export default messageServices;
