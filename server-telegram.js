const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
app.use(express.json());

// 🛠️ ตั้งค่า TOKEN และ CHAT_ID ของ Telegram Bot
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

app.post('/save-location', async (req, res) => {
  const data = req.body;
  const name = data.name || "ไม่ระบุชื่อ";
  const lat = data.lat;
  const lng = data.lng;
  const accuracy = data.accuracy;

  const log = `${new Date().toISOString()} | ${name} | Lat: ${lat}, Lng: ${lng}, Accuracy: ${accuracy}m\n`;
  fs.appendFileSync('location-log.txt', log);

  const message = `📍 แจ้งเตือนพิกัดจาก: ${name}
Lat: ${lat}
Lng: ${lng}
แม่นยำ: ${accuracy} เมตร
🔗 https://maps.google.com/?q=${lat},${lng}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });
  } catch (error) {
    console.error("❌ Telegram error:", error.message);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('🚀 Server with Telegram Bot running at http://localhost:3000');
});
