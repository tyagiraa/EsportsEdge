import React from 'react';
import PropTypes from 'prop-types';
import './GameCard.css';

function GameCard({ game }) {
  return (
    <article className="game-card">
      <div className="game-card__info">
        <h3 className="game-card__name">{game.name}</h3>
        <p className="game-card__meta">
          {game.genre} · {game.platform}
          {game.developer && ` · ${game.developer}`}
        </p>
        {typeof game.matchCount === 'number' && (
          <p className="game-card__matches">Matches: {game.matchCount}</p>
        )}
      </div>
    </article>
  );
}

GameCard.propTypes = {
  game: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    genre: PropTypes.string,
    platform: PropTypes.string,
    developer: PropTypes.string,
    matchCount: PropTypes.number,
  }).isRequired,
};

export default GameCard;
