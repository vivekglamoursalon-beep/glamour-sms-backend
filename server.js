app.post("/send-sms", async (req, res) => {
  try {
    console.log("📩 Incoming SMS payload:", req.body);

    const phone =
      req.body.phone ||
      (req.body.customer_phone
        ? "+91" + req.body.customer_phone
        : null);

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number missing",
      });
    }

    const name = req.body.name || req.body.customer_name || "Customer";
    const service = req.body.service || "Service";
    const date = req.body.date || "Date";
    const time = req.body.time || "Time";

    const message = `New Booking
Name: ${name}
Service: ${service}
Date: ${date}
Time: ${time}`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });

    console.log("✅ SMS sent to", phone);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ SMS error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
