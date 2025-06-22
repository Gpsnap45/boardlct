const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

let userCounter = 1;

app.post('/save-location', async (req, res) => {
  const { latitude, longitude, accuracy, province, timestamp } = req.body;
  const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  const timeFormatted = new Date(timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
  const message = `📍 ผู้ใช้งานลำดับที่ #${userCounter++} (User #${userCounter - 1})
จังหวัด (Province): ${province}
🌐 พิกัด (Coordinates): Latitude ${latitude}, Longitude ${longitude}
📏 ความแม่นยำ (Accuracy): ~${accuracy} เมตร
🕒 เวลา (Time): ${new Date(timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
📍 ลิงก์ (Google Maps): https://maps.google.com/?q=${latitude},${longitude}`;


  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Failed to send Telegram message:', error.response?.data || error.message);
    res.status(500).send('Failed to send message');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
