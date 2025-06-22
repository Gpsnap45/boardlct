const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

app.post('/save-location', (req, res) => {
  const data = req.body;
  console.log("Received location:", data);
  fs.appendFileSync('location-log.txt', JSON.stringify(data) + '\n');
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
