import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email: {type:String, required:true},
    subject:{type:String, required:true},
    message : {type:String, required:true},
    isReplied : {type:Boolean, default: false},
    queryReply : {type:String, default:""}
})

const contactModel = mongoose.models.contactModel || mongoose.model("contactModel", contactSchema)

export default contactModel;