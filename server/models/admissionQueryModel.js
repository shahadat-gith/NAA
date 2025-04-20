import mongoose from "mongoose"

const admisssionQuerySchema = new mongoose.Schema({
    name : {type:String, required:true},
    email: {type:String, required:true},
    message : {type:String, required:true},
    isReplied : {type:Boolean, default: false},
    queryReply : {type:String, default:""}
})

const admisssionQueryModel = mongoose.models.admisssionQueryModel || mongoose.model("admissionQueryModel", admisssionQuerySchema)

export default admisssionQueryModel;