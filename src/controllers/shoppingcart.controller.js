const { Cart } = require('../models/shoppingCart.model');
const { Producto } = require('../models/product.model');
const { User } = require('../models/user.model');

exports.createCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Verificar que el usuario exista
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Crear el carrito
    const newCart = new Cart({
      _id: new mongoose.Types.ObjectId().toString(),
      user: userId,
    });

    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId)
      .populate('user', 'name email') // Obtener datos del usuario
      .populate('product', 'name price'); // Obtener datos de productos

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCartsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const carts = await Cart.find({ user: userId })
      .populate('user', 'name email')
      .populate('product', 'name price');

    if (!carts.length) {
      return res.status(404).json({ error: 'No se encontraron carritos para este usuario.' });
    }

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart || cart.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Carrito no encontrado o ya cerrado.' });
    }

    const product = await Producto.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente para el producto.' });
    }

    // Actualizar el carrito
    cart.product.push(productId);
    const subtotal = cart.subtotal + product.price * quantity;
    const IVA = subtotal * 0.16; // Asumiendo IVA del 16%
    const total = subtotal + IVA;

    cart.subtotal = subtotal;
    cart.IVA = IVA;
    cart.total = total;

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart || cart.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Carrito no encontrado o ya cerrado.' });
    }

    // Verificar que el producto esté en el carrito
    const productIndex = cart.product.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
    }

    // Eliminar producto del carrito
    cart.product.splice(productIndex, 1);

    // Recalcular subtotal, IVA y total
    const product = await Producto.findById(productId);
    const subtotal = cart.subtotal - product.price;
    const IVA = subtotal * 0.16;
    const total = subtotal + IVA;

    cart.subtotal = subtotal;
    cart.IVA = IVA;
    cart.total = total;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.closeCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await Cart.findById(cartId);
    if (!cart || cart.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Carrito no encontrado o ya cerrado.' });
    }

    cart.status = 'INACTIVE';
    cart.endDate = Date.now();

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
