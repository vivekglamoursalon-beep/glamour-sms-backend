import express from "express";
import cors from "cors";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const app = express(); // ✅ THIS WAS MISSING
app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Glamour SMS backend running ✅");
});

// ✅ Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ SEND SMS ROUTE
app.post("/send-sms", async (req, res) => {
  try {
    console.log("📩 Incoming SMS payload:", req.body);

    const { to, message } = req.body;

    // ✅ validation
    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: "`to` or `message` missing",
      });
    }

    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to, // ✅ REQUIRED
    });

    console.log("✅ SMS sent:", sms.sid);

    res.json({ success: true, sid: sms.sid });
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ REQUIRED FOR RENDER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 SMS server running on port ${PORT}`);
});
