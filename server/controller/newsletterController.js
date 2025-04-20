import { newsLetterModel } from "../models/newsLetter.js";
import transporter from "../config/nodemailer.js";

export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingSubscription = await newsLetterModel.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "This email is already subscribed to the newsletter",
      });
    }

    const newSubscription = new newsLetterModel({ email });
    await newSubscription.save();

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to the newsletter",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await newsLetterModel.find({});

    if (newsletters.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No newsletter subscribers yet!",
      });
    }

    return res.status(200).json({
      success: true,
      newsletters,
    });
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching newsletters",
    });
  }
};

export const sendPromotionalMessage = async (req, res) => {
  const { subject, message } = req.body;

  try {
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Promotional message is required",
      });
    }

    const subscribers = await newsLetterModel.find().select("email");
    if (subscribers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subscribers found",
      });
    }

    const emailPromises = subscribers.map((subscriber) => {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: subscriber.email,
        subject: subject, 
        text: message,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    return res.status(200).json({
      success: true,
      message: `Promotional message sent to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error("Error sending promotional message:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while sending promotional message",
    });
  }
};