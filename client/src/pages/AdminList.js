import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminList.css';

function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/admins');
      setAdmins(response.data);
    } catch (err) {
      console.error('Erro ao buscar admins');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div className="admins-container">
      <div className="container">
        <div className="admins-header">
          <h1>👑 Admins da Plataforma</h1>
          <p>Conheça quem gerencia a comunidade</p>
        </div>

        {admins.length === 0 ? (
          <div className="no-data">Nenhum admin disponível</div>
        ) : (
          <div className="admins-grid">
            {admins.map((admin) => (
              <div key={admin._id} className="admin-card">
                <div className="admin-avatar">{admin.username?.charAt(0)?.toUpperCase()}</div>
                <h3>{admin.username}</h3>
                <p className="admin-email">{admin.email}</p>
                <p className="admin-bio">{admin.bio || 'Sem descrição'}</p>
                <div className="admin-links">
                  {admin.discordLink && (
                    <a href={admin.discordLink} target="_blank" rel="noopener noreferrer" className="social-link discord">
                      Discord
                    </a>
                  )}
                  {admin.telegramLink && (
                    <a href={admin.telegramLink} target="_blank" rel="noopener noreferrer" className="social-link telegram">
                      Telegram
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminList;
