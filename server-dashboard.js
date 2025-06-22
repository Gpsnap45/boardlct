const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const LOCATION_FILE = path.join(__dirname, 'locations.json');

app.post('/save-location', (req, res) => {
  const data = req.body;
  const existing = fs.existsSync(LOCATION_FILE)
    ? JSON.parse(fs.readFileSync(LOCATION_FILE))
    : [];
  existing.push(data);
  fs.writeFileSync(LOCATION_FILE, JSON.stringify(existing, null, 2));
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
  console.log('📍 Dashboard Server running at http://localhost:3000');
});
