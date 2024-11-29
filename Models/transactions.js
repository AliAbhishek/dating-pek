import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    peek:{type:Number,default:null},
    image:{type:String,default:null},
    price:{type:Number,default:null},
    name:{type:String,default:null}
},{timestamps:true})

const Transactions= mongoose.model("Transactions",transactionSchema)
export default Transactions