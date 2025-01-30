const Product = require('../models/product');
const mongoose = require('mongoose');

// Fungsi untuk mendapatkan nilai counter increment
const getNextSequenceValue = async (sequenceName) => {
  const result = await mongoose.connection.collection('counters').findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },  // Increment counter
    { returnDocument: 'after', upsert: true }  // Jika tidak ada, buat document baru
  );
  return result.value.seq;
};

// createProduct
const createProduct = async (req, res) => {
  const { name, price, stock, status } = req.body;

  try {
    // Ambil productId dari counter
    const productId = await getNextSequenceValue('productId');  // Ambil ID increment berikutnya

    const newProduct = new Product({
      productId,  // Gunakan ID increment
      name,
      price,
      stock,
      status,
    });

    await newProduct.save();
    res.status(201).json({
      productId: newProduct.productId, // Pastikan ID dikembalikan dengan format yang sama
      message: 'Produk berhasil ditambahkan',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProducts
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProductById
const getProductById = async (req, res) => {
  const { productId } = req.params; // Ganti 'id' menjadi 'productId'

  try {
    const product = await Product.findOne({ productId }); // Cari menggunakan ID increment (productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// updateProduct
const updateProduct = async (req, res) => {
  const { productId } = req.params; // Ganti 'id' menjadi 'productId'
  const { name, price, stock, status } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { productId }, // Cari berdasarkan productId
      { name, price, stock, status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// deleteProduct
const deleteProduct = async (req, res) => {
  const { productId } = req.params; // Ganti 'id' menjadi 'productId'

  try {
    const deletedProduct = await Product.findOneAndDelete({ productId });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
