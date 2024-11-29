import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    content:{type:String,trim:true,default:null},
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat",default:null},
    file:{type:String,default:null},
    gift:{type:mongoose.Schema.Types.ObjectId,ref:"Gifts",default:null},
    voucher:{type:mongoose.Schema.Types.ObjectId,ref:"Vouchers",default:null},
    isSeen:{type:Map,of:Boolean,default:{}}

},{timestamps:true})

const Message = mongoose.model("Message",messageSchema)
export default Message