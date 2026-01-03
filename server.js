import express from "express";
import twilio from "twilio";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/send-sms", async (req, res) => {
  const { customerName, customerPhone, service, date, time } = req.body;
  const msg = `New Booking\nName:${customerName}\nService:${service}\nDate:${date}\nTime:${time}`;
  try {
    await client.messages.create({ body: msg, from: process.env.TWILIO_PHONE, to: process.env.OWNER_PHONE });
    await client.messages.create({ body: msg, from: process.env.TWILIO_PHONE, to: customerPhone });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

app.listen(3000, ()=>console.log("SMS server running"));
