const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDBMongoose = require('./config/dbMongoose');
const { connectDBNative } = require('./config/dbNative');
const productRoutesMongoose = require('./routes/productRoutesMongoose');
const productRoutesNative = require('./routes/productRoutesNative');

dotenv.config();

const app = express();

// Middleware Helmet (tanpa Content Security Policy)
app.use(helmet());

app.use(express.json());

// Rute API
app.use('/api/v1/products', productRoutesNative);
app.use('/api/v2/products', productRoutesMongoose);

// Fungsi untuk memulai server setelah koneksi database berhasil
const startServer = async () => {
  try {
    await connectDBMongoose();
    await connectDBNative();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

startServer();
