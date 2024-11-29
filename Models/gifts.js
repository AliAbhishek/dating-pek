import mongoose from "mongoose";


const giftSchema = new mongoose.Schema({
    peek:{type:Number,default:null},
    image:{type:String,default:null}
},{timestamps:true})

const Gifts= mongoose.model("Gifts",giftSchema)
export default Gifts