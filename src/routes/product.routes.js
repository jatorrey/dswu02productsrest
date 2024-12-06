const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/productos', productController.getAllProducts);
router.get('/productos/:id', productController.getProductById);
router.post('/productos', productController.createProduct);
router.put('/productos/:id', productController.updateProduct);
router.delete('/productos/:id', productController.deleteProduct);

module.exports = router;