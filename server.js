const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/save-location', (req, res) => {
  const { latitude, longitude, timestamp } = req.body;
  const log = `📍 New Location\nLatitude: ${latitude}\nLongitude: ${longitude}\nTime: ${timestamp}\n\n`;
  console.log(log);
  fs.appendFileSync('location-log.txt', log);
  res.sendStatus(200);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
