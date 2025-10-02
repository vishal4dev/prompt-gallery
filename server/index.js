const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const promptsRouter = require('./routes/prompts');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/prompts', promptsRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/promptgallery';
const USE_MEMORY = String(process.env.MONGO_MEMORY || '').toLowerCase() === 'true';

async function start() {
  try {
    if (USE_MEMORY) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mem = await MongoMemoryServer.create();
      const uri = mem.getUri('promptgallery');
      await mongoose.connect(uri, { autoIndex: true });
      console.log('Connected to in-memory MongoDB');
    } else {
      await mongoose.connect(MONGO_URI, { autoIndex: true });
      console.log('Connected to MongoDB');
    }
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    // Fallback to memory server if not already using it
    if (!USE_MEMORY) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mem = await MongoMemoryServer.create();
        const uri = mem.getUri('promptgallery');
        await mongoose.connect(uri, { autoIndex: true });
        console.log('Connected to in-memory MongoDB (fallback)');
        app.listen(PORT, () => {
          console.log(`API server listening on port ${PORT}`);
        });
      } catch (fallbackErr) {
        console.error('Memory MongoDB fallback also failed', fallbackErr);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

start();

