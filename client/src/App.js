import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AdminList from './pages/AdminList';
import './styles/App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        {token && <Navigation />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/admin" element={token ? <AdminPanel /> : <Navigate to="/login" />} />
          <Route path="/admins" element={<AdminList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
