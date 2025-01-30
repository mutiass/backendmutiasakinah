const { getDb } = require('../config/dbNative');

// Fungsi untuk mendapatkan nilai counter increment
const getNextSequenceValue = async (sequenceName) => {
  const db = getDb();
  const result = await db.collection('counters').findOneAndUpdate(
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

    const db = getDb();
    const newProduct = {
      productId,  // Gunakan ID increment
      name,
      price,
      stock,
      status,
    };

    await db.collection('products').insertOne(newProduct);
    res.status(201).json({
      productId: newProduct.productId,
      message: 'Product created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProducts
const getProducts = async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection('products').find().toArray();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// getProductById
const getProductById = async (req, res) => {
  const { productId } = req.params; // Ganti 'id' menjadi 'productId'

  try {
    const db = getDb();
    const product = await db.collection('products').findOne({ productId });

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
    const db = getDb();
    const result = await db.collection('products').updateOne(
      { productId },
      { $set: { name, price, stock, status } }
    );

    if (result.matchedCount === 0) {
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
    const db = getDb();
    const result = await db.collection('products').deleteOne({ productId });

    if (result.deletedCount === 0) {
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
