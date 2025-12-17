const dueSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    unique: true,
  },

  monthlyDue: { type: Number, default: 0 },
  hostelDue: { type: Number, default: 0 },

  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Due", dueSchema);
