const express = require('express');
const app = express();
app.use(express.json());
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const connectDBNative = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI_NATIVE);
    await client.connect();
    console.log('MongoDB Native: Database Connected');
    db = client.db('dbmutia');  // Menyambung ke database 'dbmutia'
  } catch (error) {
    console.error('MongoDB Native Connection Error:', error.message);
    process.exit(1);
  }
};

const getDb = () => db;

module.exports = { connectDBNative, getDb };
