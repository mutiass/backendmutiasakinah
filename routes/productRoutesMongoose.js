const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllerMongoose');

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:productId', getProductById); // Ganti :id menjadi :productId
router.put('/:productId', updateProduct); // Ganti :id menjadi :productId
router.delete('/:productId', deleteProduct); // Ganti :id menjadi :productId

module.exports = router;
