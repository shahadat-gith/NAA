import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Notice title is required"],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    // Type helps frontend show the right icon (PDF icon vs Link icon)
    noticeType: {
        type: String,
        enum: ['TEXT', 'FILE', 'INTERNAL_LINK', 'EXTERNAL_LINK'],
        default: 'TEXT'
    },
    // Store Cloudinary URL here if noticeType is 'FILE'
    file: {
        url: { type: String },
        public_id: { type: String }
    },
    // Store external URL if noticeType is 'EXTERNAL_LINK'
    externalUrl: {
        type: String,
        default: ''
    },

    targetDate: {
        type: Date,
        default: null
    },

    linkedPage: {type: String, default: ''}, // Store internal page slug if noticeType is 'INTERNAL_LINK'
}, { timestamps: true });

const Notice = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);

export default Notice;