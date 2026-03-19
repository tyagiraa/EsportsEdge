import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './PlayerForm.css';

function PlayerForm({ player, onSubmit, onCancel }) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteGame, setFavoriteGame] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (player) {
      setUsername(player.username || '');
      setDisplayName(player.displayName || '');
      setEmail(player.email || '');
      setFavoriteGame(player.favoriteGame || '');
      setBio(player.bio || '');
    }
  }, [player]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !displayName.trim() || !email.trim()) {
      setError('Username, display name, and email are required.');
      return;
    }
    onSubmit({
      username: username.trim(),
      displayName: displayName.trim(),
      email: email.trim(),
      favoriteGame: favoriteGame.trim() || null,
      bio: bio.trim() || null,
    });
  }

  return (
    <form className="player-form" onSubmit={handleSubmit}>
      {error && <p className="player-form__error">{error}</p>}
      <div className="player-form__row">
        <label htmlFor="player-username">Username</label>
        <input
          id="player-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="player-form__row">
        <label htmlFor="player-displayName">Display name</label>
        <input
          id="player-displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      <div className="player-form__row">
        <label htmlFor="player-email">Email</label>
        <input
          id="player-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="player-form__row">
        <label htmlFor="player-favoriteGame">Favorite game</label>
        <input
          id="player-favoriteGame"
          type="text"
          value={favoriteGame}
          onChange={(e) => setFavoriteGame(e.target.value)}
        />
      </div>
      <div className="player-form__row">
        <label htmlFor="player-bio">Bio</label>
        <textarea id="player-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>
      <div className="player-form__actions">
        <button type="submit">{player ? 'Save' : 'Create'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

PlayerForm.propTypes = {
  player: PropTypes.shape({
    username: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    favoriteGame: PropTypes.string,
    bio: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default PlayerForm;
