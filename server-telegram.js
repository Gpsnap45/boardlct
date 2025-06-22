const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';

function formatDateThai(date = new Date()) {
  return date.toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    hour12: false
  });
}

app.post('/save-location', async (req, res) => {
  const { name = 'ไม่ระบุชื่อ', lat, lng, accuracy } = req.body;

  const log = `${new Date().toISOString()} | ${name} | Lat: ${lat}, Lng: ${lng}, Accuracy: ${accuracy}m\n`;
  fs.appendFileSync('location-log.txt', log);

  const dateTime = formatDateThai();
  const message = `📍 User: ${name}
Province: - (N/A)
🌐 Location (พื้นที่): https://maps.google.com/?q=${lat},${lng}
📌 Coordinates (พิกัด): Latitude: ${lat} │ Longitude: ${lng}
📏 Accuracy (รัศมี): ~${accuracy} meters (ประมาณ ${accuracy} เมตร)
🕒 Time (เวลา): ${dateTime}`;

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
