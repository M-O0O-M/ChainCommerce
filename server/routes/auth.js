const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// In-memory users storage
let users = [];
let userIdCounter = 1;

// ✅ SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: `user_${userIdCounter++}`,
      email,
      password: hashedPassword,
      name,
      authMethod: 'email',
      orders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(user);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, authMethod: user.authMethod },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ SIGNIN
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, authMethod: user.authMethod },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GOOGLE SIGNIN
router.post('/google-signin', async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        id: `user_${userIdCounter++}`,
        email,
        name,
        authMethod: 'google',
        orders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, authMethod: user.authMethod },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
