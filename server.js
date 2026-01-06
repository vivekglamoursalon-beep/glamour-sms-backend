import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(bodyParser.json());

/* ---------- ENV ---------- */
const PORT = process.env.PORT || 10000;

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  OWNER_PHONE
} = process.env;

/* ---------- TWILIO CLIENT ---------- */
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/* ---------- ROUTE ---------- */
app.post("/send-sms", async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      service,
      date,
      time
    } = req.body;

    if (!customer_phone || !customer_name) {
      return res.status(400).json({ error: "Missing customer data" });
    }

    const messageBody = `
New Booking
Name: ${customer_name}
Service: ${service}
Date: ${date}
Time: ${time}
`;

    // 🔹 SMS to OWNER
    await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: OWNER_PHONE, // +919766002781
      body: messageBody
    });

    // 🔹 SMS to CUSTOMER
    await client.messages.create({
      from: TWILIO_PHONE_NUMBER,
      to: `+91${customer_phone}`,
      body: messageBody
    });

    res.json({ success: true, message: "SMS sent to owner & customer" });

  } catch (err) {
    console.error("SMS ERROR:", err);
    res.status(500).json({ error: "SMS failed" });
  }
});

/* ---------- START ---------- */
app.listen(PORT, () => {
  console.log(`✅ SMS server running on port ${PORT}`);
});
