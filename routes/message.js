const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const fetch = require("node-fetch");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const recipientPhone = "+918850596153"; // Replace with actual recipient's number

// Function to get geolocation based on IP
// const getGeolocation = async () => {
//   try {
//     const response = await fetch("https://ipapi.co/json/"); // Public IP-based geolocation API
//     const data = await response.json();
//     return {
//       latitude: data.latitude,
//       longitude: data.longitude,
//     };
//   } catch (error) {
//     console.error("Error fetching geolocation:", error);
//     return null;
//   }
// };

// API to send an SMS with location
router.post("/send-alert", async (req, res) => {
  try {
    // const location = await getGeolocation();

    // if (!location) {
    //   return res.status(500).json({ success: false, message: "Could not fetch location" });
    // }

    const googleMapsLink = `https://www.google.com/maps?q=19.134150,72.816086`;

    const messageBody = `Alert! This is a Distress Call. Your relative Vir Bhalani is not feeling well. Please check up on them. Location: ${googleMapsLink}`;

    const response = await client.messages.create({
      body: messageBody,
      from: twilioPhone,
      to: recipientPhone,
    });

    res.status(200).json({ success: true, sid: response.sid, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
