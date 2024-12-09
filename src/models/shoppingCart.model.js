const mongoose = require('mongoose');

const shoppingcartModel = new mongoose.Schema({
    _id: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true
        },
    ],
    subtotal: { type: Number, required: true, default: 0 },
    IVA: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    creationDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null }
});

const Cart = mongoose.model('ShoppingCart', shoppingcartModel);

module.exports = { Cart };