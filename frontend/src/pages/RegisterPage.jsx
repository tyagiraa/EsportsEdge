import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password || !displayName.trim() || !email.trim()) {
      setError('All fields are required.');
      return;
    }
    try {
      const res = await register({
        username: username.trim(),
        password,
        displayName: displayName.trim(),
        email: email.trim(),
      });
      if (res && res.player && res.player._id) {
        navigate(`/players/${res.player._id}`);
      } else {
        navigate('/players');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  }

  return (
    <div>
      <h1>Register</h1>
      {error && <p className="page-error">{error}</p>}
      <form className="auth-form form-section" onSubmit={handleSubmit}>
        <div className="auth-form__row">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="auth-form__row">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-form__row">
          <label htmlFor="register-displayName">Display Name</label>
          <input
            id="register-displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div className="auth-form__row">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="auth-form__actions">
          <button type="submit">Create account</button>
        </div>
      </form>
    </div>
  );
}

RegisterPage.propTypes = {};

export default RegisterPage;
