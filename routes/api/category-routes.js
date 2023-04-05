const router = require('express').Router();
const sequelize = require("../../config/connection");
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      attributes: [['id', 'CategoryId'], ['category_name', 'Category']],
      include: [{
        model: Product,
        attributes: [['id', 'ProductId'], ['product_name', 'Product'], ['price', 'Price'], ['stock', 'Stock'], ['category_id', 'CategoryId']],
      }]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      attributes: [['id', 'CategoryId'], ['category_name', 'Category']],
      include: [{
        model: Product,
        attributes: [['id', 'ProductId'], ['product_name', 'Product'], ['price', 'Price'], ['stock', 'Stock'], ['category_id', 'CategoryId']],
      }]
    });
    if (!categoryData) {
      res.status(404).json({ message: "No categories with this id!" });
      return;
    }
    else {
      res.status(200).json(categoryData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create({ category_name: req.body.category_name });
    if (!newCategory) {
      res.status(404).json({ message: "Please enter the necessary data!" });
      return;
    }
    else {
      const newCategoryData = await Category.findByPk(newCategory.id, {
        attributes: [['id', 'CategoryId'], ['category_name', 'Category']]
      })
      res.status(200).json(newCategoryData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id
        },
      }
    );
    if (!updatedCategory[0]) {
      res.status(404).json({ message: 'No category with this id was found!' });
      return;
    }
    else {
      const updatedCategoryData = await Category.findByPk(req.params.id, {
        attributes: [['id', 'CategoryId'], ['category_name', 'Category']]
      })
      res.status(200).json(updatedCategoryData);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({ where: { id: req.params.id } });
    if (!deletedCategory) {
      res.status(404).json({ message: 'No category with this id was found!' });
      return;
    }
    else {
      res.status(200).json({ message: 'Category successfully deleted!' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
