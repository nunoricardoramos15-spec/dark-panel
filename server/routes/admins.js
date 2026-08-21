const express = require('express');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Listar todos os admins
router.get('/', async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar admins' });
  }
});

module.exports = router;
