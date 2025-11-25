const express = require('express');
const router = express.Router();

// In-memory orders storage
let orders = [];
let orderIdCounter = 1;

// Get all orders
router.get('/', async (req, res) => {
  try {
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by wallet address
router.get('/wallet/:address', async (req, res) => {
  try {
    const walletOrders = orders.filter(
      order => order.walletAddress.toLowerCase() === req.params.address.toLowerCase()
    );
    res.json(walletOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const newOrder = {
      id: `order_${orderIdCounter++}`,
      ...req.body,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
