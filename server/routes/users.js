const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Obter perfil do usuário
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
});

// Atualizar perfil
router.put('/profile/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { bio, profileImage, discordLink, telegramLink } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { bio, profileImage, discordLink, telegramLink },
      { new: true }
    ).select('-password');

    res.json({ message: 'Perfil atualizado', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

// Listar todos os admins
router.get('/admins', async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar admins' });
  }
});

module.exports = router;
