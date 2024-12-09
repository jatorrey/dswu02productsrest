const express = require('express');
const router = express.Router();
const cartController = require('../controllers/shoppingcart.controller');

//crear un carrito
router.post('/crear', cartController.createCart);

//obtener carrito por id
router.get('/:cartId', cartController.getCartById);

//obtener todos los carritos de un usuario
router.get('/user/:userId', cartController.getCartsByUser);

//agregar un producto al carrito
router.post('/agregar-producto', cartController.addProductToCart);

//eliminar un producto del carrito
router.post('/eliminar-producto', cartController.removeProductFromCart);

//cerrar un carrito
router.post('/cerrar/:cartId', cartController.closeCart);

module.exports = router;