const recoveryCode = QNWDCLC1VWT1FB55WSHTEETD;

import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Ensure all environment variables are populated safely at runtime initialization
if (!accountSid || !authToken || !fromPhoneNumber) {
  console.error(
    "[Twilio Config Error]: Missing required Twilio environment variables. Please check your .env configuration."
  );
}

// Initialize the core SDK client instance
const client = twilio(accountSid, authToken);

/**
 * Sends a transactional or promotional SMS text payload via Twilio Programmable SMS Engine
 * @param {string} to - The recipient's telephone destination identifier (e.g., '+919876543210')
 * @param {string} body - The message string body context containing the secure OTP verification sequence
 * @returns {Promise<object>} - Returns the resolved Twilio Message resource response
 */
export const sendSMS = async (to, body) => {
  try {
    // Basic sanitization: Ensure number starts with country code '+' prefix
    // For local operations in India, if no prefix is attached, prepend country code
    let formattedNumber = to.trim();
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = `+91${formattedNumber}`; // Defaults automatically to Indian locale parameters (+91)
    }

    const message = await client.messages.create({
      body: body,
      from: fromPhoneNumber,
      to: formattedNumber,
    });

    console.log(`[Twilio Success]: Message dispatched smoothly. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("[Twilio API Exception]: Failed to deliver SMS infrastructure payload.", error);
    throw new Error(`Twilio Gateway Dispatch Failure: ${error.message}`);
  }
};

export default client;