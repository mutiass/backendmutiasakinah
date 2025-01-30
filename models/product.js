const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');

// Definisikan skema produk
const productSchema = new mongoose.Schema({
  productId: {
    type: Number,  // Gunakan tipe data Number untuk ID increment
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

// Gunakan mongoose-sequence untuk menambahkan auto-increment ke field productId
productSchema.plugin(mongooseSequence(mongoose), {
  inc_field: 'productId',  // Nama field yang akan diincrement
  start_seq: 1,  // Mulai dari ID 1
  step: 1,  // Increment 1 untuk setiap produk baru
});

// Buat model berdasarkan schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
