import Event from '../models/events.js';
import Notice from '../models/noticeModel.js';

export const addNotice = async (req, res) => {
  const { title, description, date, category } = req.body;

  if (!title || !description || !date || !category) {
    return res.status(400).json({ success: false, message: "All required fields (title, description, date, category) must be provided!" });
  }

  try {
    const validCategories = ['academic', 'administrative', 'extracurricular'];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid category! Must be one of: academic, administrative, extracurricular" });
    }

    const pdfPath = req.file ? `/uploads/notices/${req.file.filename}` : null;

    const newNotice = new Notice({
      title,
      description,
      date: new Date(date),
      category: category.toLowerCase(),
      pdf: pdfPath,
    });

    await newNotice.save();

    return res.status(201).json({
      success: true,
      message: "New Notice Added successfully!",
      notice: {
        id: newNotice._id,
        title: newNotice.title,
        description: newNotice.description,
        date: newNotice.date,
        category: newNotice.category,
        pdf: newNotice.pdf,
      },
    });
  } catch (error) {
    console.error('Error adding notice:', error);
    return res.status(500).json({
      success: false,
      message: "Error adding notice!",
      error: error.message,
    });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ date: -1 })
      .select("title description date category pdf createdAt updatedAt");

    const groupedNotices = {
      academic: [],
      administrative: [],
      extracurricular: [],
    };

    notices.forEach((notice) => {
      groupedNotices[notice.category].push({
        id: notice._id,
        title: notice.title,
        description: notice.description,
        date: notice.date,
        category: notice.category,
        pdf: notice.pdf,
        createdAt: notice.createdAt,
        updatedAt: notice.updatedAt,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Notices retrieved successfully!",
      notices: groupedNotices,
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching notices!",
      error: error.message,
    });
  }
};

export const addEvents = async (req,res) =>{
  const { title, date, time } = req.body;

  if (!title || !date || !time) {
    return res.status(400).json({ success: false, message: "All required fields (title,  date, time) must be provided!" });
  }

  try {
    const newEvent = new Event({
      title,
      date: new Date(date),
      time,
    });

    await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "New Event Added successfully!",
    });
  } catch (error) {
    console.error('Error adding event:', error);
    return res.status(500).json({
      success: false,
      message: "Error adding event!",
      error: error.message,
    });
  }
}

export const getEvents = async (req,res) =>{
  try {
    const events = await Event.find()
      .sort({ date: -1 })

    return res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching events!",
      error: error.message,
    });
  }
}