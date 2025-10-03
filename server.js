const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const connectDB = require('./server/db');

connectDB();

app.use('/api/auth', require('./server/routes/auth'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});