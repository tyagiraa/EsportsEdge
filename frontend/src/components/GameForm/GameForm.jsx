import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GameForm.css';

function GameForm({ game, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [developer, setDeveloper] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (game) {
      setName(game.name || '');
      setGenre(game.genre || '');
      setPlatform(game.platform || '');
      setDeveloper(game.developer || '');
    }
  }, [game]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !genre.trim() || !platform.trim()) {
      setError('Name, genre, and platform are required.');
      return;
    }
    onSubmit({
      name: name.trim(),
      genre: genre.trim(),
      platform: platform.trim(),
      developer: developer.trim() || null,
    });
  }

  return (
    <form className="game-form" onSubmit={handleSubmit}>
      {error && <p className="game-form__error">{error}</p>}
      <div className="game-form__row">
        <label htmlFor="game-name">Name</label>
        <input
          id="game-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="game-form__row">
        <label htmlFor="game-genre">Genre</label>
        <input
          id="game-genre"
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
      </div>
      <div className="game-form__row">
        <label htmlFor="game-platform">Platform</label>
        <input
          id="game-platform"
          type="text"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
        />
      </div>
      <div className="game-form__row">
        <label htmlFor="game-developer">Developer</label>
        <input
          id="game-developer"
          type="text"
          value={developer}
          onChange={(e) => setDeveloper(e.target.value)}
        />
      </div>
      <div className="game-form__actions">
        <button type="submit">{game ? 'Save' : 'Create'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

GameForm.propTypes = {
  game: PropTypes.shape({
    name: PropTypes.string,
    genre: PropTypes.string,
    platform: PropTypes.string,
    developer: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default GameForm;
