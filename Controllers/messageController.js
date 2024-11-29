import messageServices from "../Services/messageServices.js";


const messageControler = {
    sendMessage:async(req,res)=>{
        try {
            let data = await messageServices.sendMessage(req,res)
        } catch (error) {
            return errorRes(res, 500, error.message);
        }
    },
    getAllMessage:async(req,res)=>{
        try {
            let data = await messageServices.getAllMessage(req,res)
        } catch (error) {
            return errorRes(res, 500, error.message);
        }
    },
    getGiftsList:async(req,res)=>{
        try {
            let data = await messageServices.getGiftsList(req,res)
        } catch (error) {
            return errorRes(res, 500, error.message);
        }
    },
    addGifts:async(req,res)=>{
        try {
            let data = await messageServices.addGifts(req,res)
        } catch (error) {
            return errorRes(res, 500, error.message);
        }
    },
    getVoucherList:async(req,res)=>{
        try {
            let data = await messageServices.getVoucherList(req,res)
        } catch (error) {
            return errorRes(res, 500, error.message);
        }
    },
   
}

export default messageControler