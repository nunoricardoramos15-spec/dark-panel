import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const [servers, setServers] = useState([]);
  const [pendingServers, setPendingServers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user?.isAdmin) {
      fetchServers();
    }
  }, []);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('/api/servers/pending', config);
      setPendingServers(response.data);
    } catch (err) {
      console.error('Erro ao buscar servidores');
    } finally {
      setLoading(false);
    }
  };

  const approveServer = async (serverId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/servers/${serverId}/approve`, {}, config);
      fetchServers();
    } catch (err) {
      console.error('Erro ao aprovar servidor');
    }
  };

  const rejectServer = async (serverId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/servers/${serverId}/reject`, {}, config);
      fetchServers();
    } catch (err) {
      console.error('Erro ao rejeitar servidor');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container">
        <div className="error-message">Acesso negado. Apenas admins podem acessar este painel.</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="container">
        <div className="admin-header">
          <h1>🔐 Painel Admin</h1>
          <p>Gerencie servidores e conteúdo da plataforma</p>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Servidores Pendentes ({pendingServers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Servidores Aprovados
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'pending' && (
            <div className="servers-list">
              <h2>Servidores Aguardando Aprovação</h2>
              {loading ? (
                <div className="loading">Carregando...</div>
              ) : pendingServers.length === 0 ? (
                <div className="no-data">Nenhum servidor pendente</div>
              ) : (
                pendingServers.map((server) => (
                  <div key={server._id} className="server-card">
                    <div className="server-info">
                      <h3>{server.name}</h3>
                      <p>{server.description}</p>
                      <div className="server-links">
                        <a href={server.discordLink} target="_blank" rel="noopener noreferrer" className="link-badge discord">
                          Discord
                        </a>
                        {server.telegramLink && (
                          <a href={server.telegramLink} target="_blank" rel="noopener noreferrer" className="link-badge telegram">
                            Telegram
                          </a>
                        )}
                      </div>
                      <p className="submitted-by">Enviado por: {server.submittedBy?.username}</p>
                    </div>
                    <div className="server-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => approveServer(server._id)}
                      >
                        ✓ Aprovar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => rejectServer(server._id)}
                      >
                        ✕ Rejeitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
