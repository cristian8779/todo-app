import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error al registrarse:', error);
      setError('Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container register-container register-page">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Crear cuenta</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="input-container">
          <i className="material-icons">person</i>
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            required
            value={form.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="input-container">
          <i className="material-icons">email</i>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="input-container password-container">
          <i className="material-icons">lock</i>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            required
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <span className="material-icons">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Registrarse'}
        </button>

        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="register-link">
            Inicia sesión
          </Link>
        </p>
      </form>

      {/* Tarjeta de éxito */}
      {showSuccessMessage && (
        <div className="success-card">
          <p>¡Usuario registrado con éxito!</p>
        </div>
      )}
    </div>
  );
};

export default Register;
