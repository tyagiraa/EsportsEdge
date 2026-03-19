import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
  return (
    <article className="game-card">
      <div className="game-card__info">
        <h3 className="game-card__name">
          <Link to={`/matches?gameId=${game._id}`}>{game.name}</Link>
        </h3>
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
