const express = require('express');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Criar post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, images } = req.body;

    const post = new Post({
      author: req.user.id,
      title,
      content,
      images: images || [],
    });

    await post.save();
    await post.populate('author', 'username profileImage');

    res.status(201).json({ message: 'Post criado com sucesso', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar post' });
  }
});

// Listar todos os posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username profileImage')
      .populate('comments.user', 'username profileImage')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar posts' });
  }
});

// Obter post por ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profileImage')
      .populate('comments.user', 'username profileImage');
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar post' });
  }
});

// Dar like no post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ message: 'Like atualizado', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao dar like' });
  }
});

// Adicionar comentário
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    post.comments.push({
      user: req.user.id,
      text,
    });

    await post.save();
    await post.populate('comments.user', 'username profileImage');
    res.json({ message: 'Comentário adicionado', post });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar comentário' });
  }
});

// Deletar post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Você não pode deletar este post' });
    }

    await Post.findByIdAndRemove(req.params.id);
    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar post' });
  }
});

module.exports = router;
