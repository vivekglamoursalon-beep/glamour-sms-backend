app.post('/send-sms', async (req, res) => {
  try {
    const { name, service, date, time, phone } = req.body;

    console.log("📩 Incoming request:", req.body);

    if (!phone) {
      return res.status(400).json({ error: "Phone number missing" });
    }

    const message = `
New Booking
Name: ${name}
Service: ${service}
Date: ${date}
Time: ${time}
`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ SMS error:", error.message);
    res.status(500).json({ error: "SMS failed" });
  }
});
