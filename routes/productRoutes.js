const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/', updateProduct);
router.put('/:id', updateProduct);
router.delete('/', deleteProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
