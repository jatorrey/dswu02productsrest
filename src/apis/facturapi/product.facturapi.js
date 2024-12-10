const facturapi = require('./connection.facturapi');

async function createProduct(product) {
    const categoryToKey = {
        'Bebidas': '50161802',
        'Lácteos': '50171701',
        'Carnes': '50111500',
        'Frutas': '50161501',
        'Verduras': '50161811',
        'Panadería': '50181903',
        'Dulces': '50192101',
        'Limpieza': '47131800',
        'Higiene': '53131605',
        'Enlatados': '50161806'
    };

    const productKey = categoryToKey[product.category];

    const facturapiProduct = {
        description: product.description,
        product_key: productKey,
        price: product.price,
    };
    return await facturapi.products.create(facturapiProduct);
}

async function updateProduct(facturapiid, product) {
    const facturapiProduct = {
        description: product.description,
        product_key: "43211902",
        price: product.price,
    };
    return await facturapi.products.update(facturapiid, facturapiProduct);
}

async function deleteProduct(product) {
    return await facturapi.products.delete(product.facturapiid);
}

module.exports = {
    createProduct
    , updateProduct
    , deleteProduct
};