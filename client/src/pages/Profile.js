import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/profile/${id}`);
      setUserProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`/api/users/profile/${id}`, formData, config);
      setUserProfile(response.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao atualizar perfil');
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  if (!userProfile) return <div className="error-message">Usuário não encontrado</div>;

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{userProfile.username?.charAt(0)?.toUpperCase()}</div>
            <div className="profile-info">
              <h1>{userProfile.username}</h1>
              {userProfile.isAdmin && (
                <span className="admin-badge">👑 Admin</span>
              )}
              <p className="profile-email">{userProfile.email}</p>
            </div>
          </div>

          {isOwnProfile && !isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Editar Perfil
            </button>
          )}

          {isEditing && isOwnProfile ? (
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Conte algo sobre você"
                />
              </div>

              <div className="form-group">
                <label>Link Discord</label>
                <input
                  type="url"
                  value={formData.discordLink || ''}
                  onChange={(e) => setFormData({ ...formData, discordLink: e.target.value })}
                  placeholder="https://discord.gg/..."
                />
              </div>

              <div className="form-group">
                <label>Link Telegram</label>
                <input
                  type="url"
                  value={formData.telegramLink || ''}
                  onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
                  placeholder="https://t.me/..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              {userProfile.bio && (
                <div className="detail">
                  <label>Bio</label>
                  <p>{userProfile.bio}</p>
                </div>
              )}

              {userProfile.discordLink && (
                <div className="detail">
                  <label>Discord</label>
                  <a href={userProfile.discordLink} target="_blank" rel="noopener noreferrer" className="link">
                    Visitar Discord
                  </a>
                </div>
              )}

              {userProfile.telegramLink && (
                <div className="detail">
                  <label>Telegram</label>
                  <a href={userProfile.telegramLink} target="_blank" rel="noopener noreferrer" className="link">
                    Visitar Telegram
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
