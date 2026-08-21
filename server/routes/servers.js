const express = require('express');
const Server = require('../models/Server');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Submeter novo server (requer aprovação)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, image, discordLink, telegramLink } = req.body;

    if (!name || !description || !discordLink) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }

    const server = new Server({
      name,
      description,
      image,
      discordLink,
      telegramLink,
      submittedBy: req.user.id,
    });

    await server.save();
    await server.populate('submittedBy', 'username');

    res.status(201).json({
      message: 'Server submetido para aprovação',
      server,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao submeter server' });
  }
});

// Listar servers aprovados
router.get('/approved', async (req, res) => {
  try {
    const servers = await Server.find({ status: 'approved' })
      .populate('submittedBy', 'username')
      .populate('approvedBy', 'username');
    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar servers' });
  }
});

// Listar pendências (apenas admins)
router.get('/pending', auth, adminOnly, async (req, res) => {
  try {
    const servers = await Server.find({ status: 'pending' })
      .populate('submittedBy', 'username');
    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar servers pendentes' });
  }
});

// Aprovar server (apenas admins)
router.put('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user.id },
      { new: true }
    ).populate('approvedBy', 'username');

    res.json({ message: 'Server aprovado', server });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aprovar server' });
  }
});

// Rejeitar server (apenas admins)
router.put('/:id/reject', auth, adminOnly, async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    res.json({ message: 'Server rejeitado', server });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao rejeitar server' });
  }
});

module.exports = router;
