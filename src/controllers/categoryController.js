const Category = require('../models/Category');
const Product = require('../models/Product');

async function listCategories(req, res, next) {
  try {
    const categories = await Category.find();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name es requerido' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ data: { id: req.params.id } });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
