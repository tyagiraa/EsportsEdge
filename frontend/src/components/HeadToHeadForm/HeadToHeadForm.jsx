import React from 'react';
import PropTypes from 'prop-types';
import './HeadToHeadForm.css';

function HeadToHeadForm({ players, player1Id, player2Id, onPlayer1Change, onPlayer2Change, onSubmit }) {
  return (
    <form className="head-to-head-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="head-to-head-form__row">
        <label htmlFor="h2h-player1">Player 1</label>
        <select
          id="h2h-player1"
          value={player1Id}
          onChange={(e) => onPlayer1Change(e.target.value)}
          required
        >
          <option value="">Select player</option>
          {(players || []).map((p) => (
            <option key={p._id} value={p._id}>
              {p.displayName || p.username}
            </option>
          ))}
        </select>
      </div>
      <div className="head-to-head-form__row">
        <label htmlFor="h2h-player2">Player 2</label>
        <select
          id="h2h-player2"
          value={player2Id}
          onChange={(e) => onPlayer2Change(e.target.value)}
          required
        >
          <option value="">Select player</option>
          {(players || []).map((p) => (
            <option key={p._id} value={p._id}>
              {p.displayName || p.username}
            </option>
          ))}
        </select>
      </div>
      <div className="head-to-head-form__actions">
        <button type="submit">Compare</button>
      </div>
    </form>
  );
}

HeadToHeadForm.propTypes = {
  players: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      username: PropTypes.string,
      displayName: PropTypes.string,
    })
  ).isRequired,
  player1Id: PropTypes.string.isRequired,
  player2Id: PropTypes.string.isRequired,
  onPlayer1Change: PropTypes.func.isRequired,
  onPlayer2Change: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default HeadToHeadForm;
