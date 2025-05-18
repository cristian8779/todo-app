import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faClipboardList } from '@fortawesome/free-solid-svg-icons'; // Agregamos el icono de tareas
import { jwtDecode } from 'jwt-decode';
import '../styles/Navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error('Token inválido:', err);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <h1>
        <FontAwesomeIcon icon={faClipboardList} className="task-icon" /> {/* Icono de tareas */}
        Mis notas
      </h1>
      {username && (
        <div className="user-info">
          <FontAwesomeIcon 
            icon={faUserCircle} 
            size="2x" 
            className="profile-icon" 
            title="Perfil" 
          />
          <span className="username">{username}</span>
          <FontAwesomeIcon
            icon={faSignOutAlt}
            size="2x"
            className="logout-icon"
            onClick={handleLogout}
            title="Cerrar sesión"
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
