const Order = require('../models/Order');
const Product = require('../models/Product');
const { decreaseStock } = require('./productController');

const DISCOUNT_CODES = {
  BIENVENIDA10: 0.1,
  AGENCIA01: 0.15,
};

async function createOrder(req, res, next) {
  try {
    const { items, discountCode } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'La orden debe tener al menos un item' });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ error: `Producto no encontrado: ${item.productId}` });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
      });

      total += product.price * item.quantity;

      decreaseStock(product._id, item.quantity);
    }

    if (discountCode && DISCOUNT_CODES[discountCode]) {
      total = total - total * DISCOUNT_CODES[discountCode];
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      discountCode: discountCode || null,
      total,
    });

    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
}

async function listOrders(req, res, next) {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter).populate('items.product', 'name price');
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, listOrders, getOrder, updateOrderStatus };
