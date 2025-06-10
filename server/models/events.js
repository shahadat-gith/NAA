import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, 'Title is required'],
        trim: true,

    },
    date : {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    time : {
        type: String,
        required: [true, 'Time is required'],
        trim: true,
    },
})
const Event = mongoose.models.events || mongoose.model('Event', eventSchema);
export default Event;