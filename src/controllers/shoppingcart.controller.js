const Cart = require('../models/shoppingCart.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

// Crear un carrito nuevo y asociarlo a un usuario
const createCart = async (req, res) => {
    try {
        const { usuario } = req.body;

        // Verificar si el usuario existe
        const userExists = await User.findById(usuario);
        if (!userExists) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Crear el carrito
        const newCart = new Cart({ usuario });
        await newCart.save();

        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito', error });
    }
};

// Obtener un carrito específico por su _id
const getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id).populate('usuario').populate('productos.producto');

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Obtener todos los carritos de un usuario por el _id del usuario
const getCartsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const carts = await Cart.find({ usuario: userId }).populate('productos.producto');

        if (!carts.length) {
            return res.status(404).json({ message: 'No se encontraron carritos para este usuario' });
        }

        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los carritos', error });
    }
};

// Agregar un producto a un carrito
const addProductToCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { producto, cantidad } = req.body;

        // Verificar si el carrito existe
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Verificar si el producto existe
        const productExists = await Product.findById(producto);
        if (!productExists) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Agregar el producto al carrito
        const productInCart = cart.productos.find(p => p.producto.toString() === producto);
        if (productInCart) {
            productInCart.cantidad += cantidad;
        } else {
            cart.productos.push({ producto, cantidad });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito', error });
    }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { producto } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtrar los productos del carrito
        cart.productos = cart.productos.filter(p => p.producto.toString() !== producto);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
};

// Cerrar un carrito
const closeCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        if (cart.estatus === 'Inactivo') {
            return res.status(400).json({ message: 'El carrito ya está cerrado' });
        }

        // Calcular totales
        cart.subtotal = cart.productos.reduce((sum, p) => sum + (p.cantidad * p.producto.precio), 0);
        cart.iva = cart.subtotal * 0.16;
        cart.total = cart.subtotal + cart.iva;
        cart.estatus = 'Inactivo';
        cart.fechaCierre = new Date();

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar el carrito', error });
    }
};

module.exports = {
    createCart,
    getCartById,
    getCartsByUserId,
    addProductToCart,
    removeProductFromCart,
    closeCart
};
