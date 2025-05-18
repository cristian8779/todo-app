import React, { useState } from 'react';
import { login } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(form);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        navigate('/dashboard');
      } else {
        setError('Token no recibido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login-container login-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Iniciar Sesión</h2>

        {error && <div className="error-message">{error}</div>}

        {/* Email */}
        <div className={`input-container ${focusedField === 'email' ? 'focused' : ''}`}>
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            autoComplete="username"
          />
        </div>

        {/* Contraseña */}
        <div className={`input-container ${focusedField === 'password' ? 'focused' : ''}`}>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        <button type="submit" disabled={loading} className="login-button">
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Entrar'}
        </button>

        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="register-link">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
