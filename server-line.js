const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();
app.use(express.json());

// ✅ วาง LINE Notify Token ของคุณตรงนี้
const LINE_NOTIFY_TOKEN = 'YOUR_LINE_NOTIFY_TOKEN_HERE';

app.post('/save-location', async (req, res) => {
  const data = req.body;
  const log = `${new Date().toISOString()} | Lat: ${data.lat}, Lng: ${data.lng}, Accuracy: ${data.accuracy}m\n`;
  fs.appendFileSync('location-log.txt', log);

  try {
    await axios.post(
      'https://notify-api.line.me/api/notify',
      `message=📍 แจ้งเตือนตำแหน่ง:\nLat: ${data.lat}\nLng: ${data.lng}\nแม่นยำ: ${data.accuracy} ม.`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`
        }
      }
    );
  } catch (error) {
    console.error("❌ Line Notify error:", error.message);
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('🚀 Server with LINE Notify running at http://localhost:3000');
});
