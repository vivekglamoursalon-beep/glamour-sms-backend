import express from "express";
import twilio from "twilio";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post("/send-sms", async (req, res) => {
  // ✅ MATCH FRONTEND FIELD NAMES
  const { name, phone, service, date, time } = req.body;

  const msg =
`New Booking
Name: ${name}
Service: ${service}
Date: ${date}
Time: ${time}`;

  try {
    // Owner SMS
    await client.messages.create({
      body: msg,
      from: process.env.TWILIO_PHONE,
      to: process.env.OWNER_PHONE
    });

    // Customer SMS
    await client.messages.create({
      body: msg,
      from: process.env.TWILIO_PHONE,
      to: phone
    });

    res.json({ success: true });
  } catch (error) {
    console.error("SMS error:", error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("SMS server running on port", PORT);
});
