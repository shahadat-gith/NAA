import contactModel from "../models/contactModel.js";
import admisssionQueryModel from "../models/admissionQueryModel.js";
import transporter from "../config/nodemailer.js";

export const submitAdmissionQuery =  async (req, res)=>{
    const {name,email,message} = req.body;

    if(!name || !email || !message){
        return res.json({success:false, message : "All fields are required!"})
    }

    try {
        const newQuery = new admisssionQueryModel({name,email,message})
        await newQuery.save()
        return res.json({success:true, message:"Your Query is submitted successfully! we will get back to you as soon as possible!"})
        
    } catch (error) {
        return res.json({success:false, message : error.message})
    }

}


export const submitContactQuery =  async (req, res)=>{
    const {name,email,subject,message} = req.body;

    if(!name || !email || !subject || !message){
        return res.json({success:false, message : "All fields are required!"})
    }

    try {
        const newQuery = new contactModel({name,email,subject,message})
        await newQuery.save()
        return res.json({success:true, message:"Your Query is submitted successfully! we will get back to you as soon as possible!"})
        
    } catch (error) {
        return res.json({success:false, message : error.message})
    }

}


export const getAllAdmissionQueries = async (req,res) =>{
    try {
        const queries = await admisssionQueryModel.find()

        if(!queries){
            return res.json({success:false, message:"Queries not found!"})
        }


        return res.json({success:true, queries})


        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}


export const getAllContactQueries = async (req,res) =>{
    try {
        const queries = await contactModel.find({})

        if(!queries){
            return res.json({success:false, message:"Queries not found!"})
        }


        return res.json({success:true, queries})


        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}




export const contactQueryReply = async (req, res) => {
    const { id } = req.params;  // Get query ID from URL params
    const { email, text } = req.body;

    try {
        // Send reply email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Query Reply from Nashib Ali Academy",
            text: text
        });

        // Update `isReplied` status in the database
        await contactModel.findByIdAndUpdate(id, { isReplied: true, queryReply: text });

        return res.json({ success: true, message: "Query replied successfully!" });
    } catch (error) {
        return res.json({ success: false, message: "Query reply unsuccessful, try again!!" });
    }
};

export const admissionQueryReply = async (req, res) => {
    const { id } = req.params;  // Get query ID from URL params
    const { email, text } = req.body;

    try {
        // Send reply email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Query Reply from Nashib Ali Academy",
            text: text
        });

        // Update `isReplied` status in the database
        await admisssionQueryModel.findByIdAndUpdate(id, { isReplied: true,queryReply:text });

        return res.json({ success: true, message: "Query replied successfully!" });
    } catch (error) {
        return res.json({ success: false, message: "Query reply unsuccessful, try again!!" });
    }
};
