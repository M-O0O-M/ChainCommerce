const express = require('express');
const router = express.Router();
const productsData = require('../productsData');

// In-memory products storage (initialized from productsData)
let products = productsData.map((product, index) => ({
  id: `prod_${index + 1}`,
  ...product
}));

// Get all products with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filteredProducts = category 
      ? products.filter(p => p.category === category)
      : products;
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(products.map(p => p.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const newProduct = {
      id: `prod_${products.length + 1}`,
      ...req.body
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
