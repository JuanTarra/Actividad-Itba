const Product = require('../models/Product');

async function listProducts(req, res, next) {
  try {
    const { search, category, page = 1, limit = 10, sort = 'name' } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(filter);

    res.json({
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ error: 'name, price y category son requeridos' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    });

    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
}

async function decreaseStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  await product.save();
  return product;
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  decreaseStock,
};
