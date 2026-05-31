import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "smtp-relay.brevo.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_KEY,  
  },
});

// Run an automatic startup handshake diagnostic validation check
transporter.verify((error, success) => {
  if (error) {
    console.error("\x1b[31m[SMTP Relay Failure]: Handshake validation crashed.\x1b[0m", error.message);
  } else {
    console.log("\x1b[32m[SMTP Relay Success]: Connected to Brevo. Recovery pipeline is active!\x1b[0m");
  }
});

export default transporter;