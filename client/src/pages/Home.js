import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', images: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (err) {
      setError('Erro ao carregar posts');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.post('/api/posts', newPost, config);
      setPosts([response.data.post, ...posts]);
      setNewPost({ title: '', content: '', images: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(`/api/posts/${postId}/like`, {}, config);
      fetchPosts();
    } catch (err) {
      console.error('Erro ao dar like');
    }
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="home-header">
          <h1>Bem-vindo, <span>{user?.username}</span>!</h1>
          <p>Compartilhe seus momentos com a comunidade</p>
        </div>

        {/* Formulário de novo post */}
        <div className="card create-post">
          <h2>Criar Postagem</h2>
          <form onSubmit={handlePostSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                placeholder="Digite o título do seu post"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Conteúdo</label>
              <textarea
                placeholder="Escreva seu post aqui..."
                rows="5"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Postando...' : 'Postar'}
            </button>
          </form>
        </div>

        {/* Feed de posts */}
        <div className="posts-feed">
          <h2>Feed da Comunidade</h2>
          {posts.length === 0 ? (
            <div className="no-data">Nenhum post ainda. Seja o primeiro a postar!</div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">{post.author?.username?.charAt(0)?.toUpperCase()}</div>
                    <div>
                      <p className="author-name">{post.author?.username}</p>
                      <p className="post-date">há {Math.floor((new Date() - new Date(post.createdAt)) / 60000)} minutos</p>
                    </div>
                  </div>
                </div>

                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  {post.images && post.images.length > 0 && (
                    <div className="post-images">
                      {post.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Post ${idx}`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button className="action-btn" onClick={() => handleLike(post._id)}>
                    ❤️ {post.likes?.length || 0} Likes
                  </button>
                  <button className="action-btn">
                    💬 {post.comments?.length || 0} Comentários
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
