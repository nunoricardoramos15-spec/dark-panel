const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Registrar usuário
router.post('/register', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Verificar se usuário já existe
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'Usuário ou email já existe' });
    }

    // Criar novo usuário
    user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Criar JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').exists(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Verificar se usuário existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Criar JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});

module.exports = router;
