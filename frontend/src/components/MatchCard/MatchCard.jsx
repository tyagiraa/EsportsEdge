import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MatchCard.css';

function MatchCard({ match, gameName, playerNames, winnerName }) {
  const id = match._id != null ? String(match._id) : '';
  const dateStr = match.date ? new Date(match.date).toLocaleDateString() : '—';
  return (
    <article className="match-card">
      <div className="match-card__info">
        <h3 className="match-card__title">
          <Link to={id ? `/matches/${id}` : '#'}>{gameName || 'Match'}</Link>
        </h3>
        <p className="match-card__date">{dateStr}</p>
        {playerNames && playerNames.length > 0 && (
          <p className="match-card__players">Players: {playerNames.join(' vs ')}</p>
        )}
        {winnerName && <p className="match-card__winner">Winner: {winnerName}</p>}
        {match.score && <p className="match-card__score">{match.score}</p>}
      </div>
      {id && (
        <Link to={`/matches/${id}`} className="match-card__btn">
          View
        </Link>
      )}
    </article>
  );
}

MatchCard.propTypes = {
  match: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    players: PropTypes.array,
    winnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    score: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  gameName: PropTypes.string,
  playerNames: PropTypes.arrayOf(PropTypes.string),
  winnerName: PropTypes.string,
};

export default MatchCard;
