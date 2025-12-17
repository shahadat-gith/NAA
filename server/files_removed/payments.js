import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId : {type:mongoose.Schema.Types.ObjectId, ref : "Student", required : true},
  amount: { type: Number, required: true, min: 0 },
  paymentDate: { type: Date, default: Date.now },
  transactionId: { type: String },
  orderId: { type: String },
  paymentId: { type: String },
  signature: { type: String },
  paymentType: {
    type: String,
    required: true,
    enum: ["admissionfee", "hosteladmissionfee", "monthlyfee", "hostelmonthlyfee"],
  },
  paymentMode: { type: String, required: true, default: "cash" },
  status: { type: String, default: "pending" },
});


const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
