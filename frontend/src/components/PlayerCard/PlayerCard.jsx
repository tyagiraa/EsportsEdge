import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './PlayerCard.css';

function PlayerCard({ player }) {
  const id = player._id;
  return (
    <article className="player-card">
      <div className="player-card__info">
        <h3 className="player-card__name">
          <Link to={`/players/${id}`}>{player.displayName || player.username}</Link>
        </h3>
        <p className="player-card__username">@{player.username}</p>
        {player.favoriteGame && (
          <p className="player-card__game">Favorite: {player.favoriteGame}</p>
        )}
      </div>
      <div className="player-card__actions">
        <Link to={`/players/${id}`} className="player-card__btn">
          View
        </Link>
      </div>
    </article>
  );
}

PlayerCard.propTypes = {
  player: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    email: PropTypes.string,
    favoriteGame: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
};

export default PlayerCard;
