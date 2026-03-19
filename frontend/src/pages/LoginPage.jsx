import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Username and password are required.');
      return;
    }
    try {
      await login({ username: username.trim(), password });
      await refresh();
      const me = await getMe();
      if (!me || !me.user) {
        setError('Login did not persist. Please try again.');
        return;
      }
      if (me && me.player && me.player._id) {
        navigate(`/players/${me.player._id}`);
      } else {
        navigate('/players');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p className="page-error">{error}</p>}
      <form className="auth-form form-section" onSubmit={handleSubmit}>
        <div className="auth-form__row">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="auth-form__row">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-form__actions">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
