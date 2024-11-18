const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { mongodb_client } = require('./db');
const { hashPassword, isPasswordCorrect, attachJWT, extractJWT } = require('./security');

// Create, initialize, and run express app.

const app = express();

app.use(cors()); // handles cors issues
app.use(bodyParser.json()); // parses request body so we can access it via req.body

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});