import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Navigation.css';

function Navigation() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PANEL</span>
          <span className="logo-font">FONT</span>
          <span className="logo-bless">BLESS</span>
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/admins" className="nav-link">
            Admins
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              🔐 Painel Admin
            </Link>
          )}
        </div>

        <div className="nav-user">
          <div className="user-menu" onClick={() => setShowMenu(!showMenu)}>
            <div className="user-avatar">{user?.username?.charAt(0)?.toUpperCase()}</div>
            <span className="user-name">{user?.username}</span>
          </div>

          {showMenu && (
            <div className="dropdown-menu">
              <Link to={`/profile/${user?.id}`} className="dropdown-item">
                Perfil
              </Link>
              <button className="dropdown-item logout" onClick={handleLogout}>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
