const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const LOCATION_FILE = path.join(__dirname, 'locations.json');

// ใส่ TOKEN และ CHAT ID Telegram ของคุณที่นี่
const TELEGRAM_BOT_TOKEN = '7908002687:AAEyUni3Z7t7bC0sKwXQP4EqTZ0HsH8zc1E';
const TELEGRAM_CHAT_ID = '6576015343';

app.post('/save-location', async (req, res) => {
  const data = req.body;
  const existing = fs.existsSync(LOCATION_FILE)
    ? JSON.parse(fs.readFileSync(LOCATION_FILE))
    : [];

  existing.push(data);
  fs.writeFileSync(LOCATION_FILE, JSON.stringify(existing, null, 2));

  // สร้างข้อความส่งเข้า Telegram
  const message = `📍 คนใหม่เข้ามาแล้ว!
ชื่อ: ${data.name}
เวลา: ${data.timestamp}
🔗 https://maps.google.com/?q=${data.lat},${data.lng}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });
  } catch (err) {
    console.error("Telegram แจ้งเตือนผิดพลาด:", err.message);
  }

  res.sendStatus(200);
});

app.get('/locations', (req, res) => {
  if (!fs.existsSync(LOCATION_FILE)) {
    return res.json([]);
  }
  const data = fs.readFileSync(LOCATION_FILE);
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(3000, () => {
  console.log('📍 Dashboard + Telegram Server running at http://localhost:3000');
});
