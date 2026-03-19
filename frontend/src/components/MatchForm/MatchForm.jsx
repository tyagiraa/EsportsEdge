import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import './MatchForm.css';

function MatchForm({ match, games, players, onSubmit, onCancel }) {
  const [gameId, setGameId] = useState('');
  const [gameQuery, setGameQuery] = useState('');
  const [date, setDate] = useState('');
  const [playerIds, setPlayerIds] = useState([]);
  const [winnerId, setWinnerId] = useState('');
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const sortedGames = useMemo(
    () => [...(games || [])].sort((a, b) => a.name.localeCompare(b.name)),
    [games]
  );
  const filteredGames = useMemo(() => {
    if (!gameQuery.trim()) return sortedGames;
    const query = gameQuery.trim().toLowerCase();
    return sortedGames.filter((g) => g.name.toLowerCase().includes(query));
  }, [sortedGames, gameQuery]);

  useEffect(() => {
    if (match) {
      const selectedGameId = match.gameId?.toString?.() ?? match.gameId ?? '';
      setGameId(selectedGameId);
      const selectedGame = (games || []).find((g) => String(g._id) === String(selectedGameId));
      setGameQuery(selectedGame?.name || '');
      setDate(
        match.date
          ? new Date(match.date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setPlayerIds(
        Array.isArray(match.players)
          ? match.players.map((p) => (typeof p === 'object' && p?.toString ? p.toString() : p))
          : []
      );
      setWinnerId(match.winnerId?.toString?.() ?? match.winnerId ?? '');
      setScore(match.score || '');
      setNotes(match.notes || '');
    } else {
      setGameId('');
      setGameQuery('');
      setDate(new Date().toISOString().slice(0, 16));
    }
  }, [match, games]);

  function handleGameQueryChange(value) {
    setGameQuery(value);
    const exact = sortedGames.find((g) => g.name.toLowerCase() === value.trim().toLowerCase());
    if (exact) setGameId(String(exact._id));
  }

  function handleGameSelectChange(value) {
    setGameId(value);
    const selected = sortedGames.find((g) => String(g._id) === String(value));
    setGameQuery(selected?.name || '');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const selectedPlayers = playerIds.filter(Boolean);
    if (
      !gameId.trim() ||
      !date.trim() ||
      !Array.isArray(playerIds) ||
      selectedPlayers.length === 0
    ) {
      setError('Game, date, and at least one player are required.');
      return;
    }
    onSubmit({
      gameId: gameId.trim(),
      date: new Date(date).toISOString(),
      players: selectedPlayers,
      winnerId: winnerId.trim() || null,
      score: score.trim() || null,
      notes: notes.trim() || null,
    });
  }

  function addPlayer() {
    setPlayerIds([...playerIds, players?.[0]?._id ?? '']);
  }

  function removePlayer(index) {
    setPlayerIds(playerIds.filter((_, i) => i !== index));
  }

  function setPlayerAt(index, id) {
    const next = [...playerIds];
    next[index] = id;
    setPlayerIds(next);
  }

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      {error && <p className="match-form__error">{error}</p>}
      <div className="match-form__row">
        <label htmlFor="match-game-search">Find game</label>
        <input
          id="match-game-search"
          type="text"
          value={gameQuery}
          onChange={(e) => handleGameQueryChange(e.target.value)}
          placeholder="Type game name..."
          list="match-game-options"
          autoComplete="off"
        />
        <datalist id="match-game-options">
          {sortedGames.map((g) => (
            <option key={g._id} value={g.name} />
          ))}
        </datalist>
      </div>
      <div className="match-form__row">
        <label htmlFor="match-game">Game</label>
        <select
          id="match-game"
          value={gameId}
          onChange={(e) => handleGameSelectChange(e.target.value)}
          required
        >
          <option value="">Select game</option>
          {filteredGames.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
        <small className="match-form__hint">
          Type to narrow games, then confirm the game from the dropdown.
        </small>
      </div>
      <div className="match-form__row">
        <label htmlFor="match-date">Date</label>
        <input
          id="match-date"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="match-form__row">
        <label>Players</label>
        {(playerIds || []).map((pid, index) => (
          <div key={index} className="match-form__player-row">
            <select value={pid} onChange={(e) => setPlayerAt(index, e.target.value)} required>
              <option value="">Select player</option>
              {(players || []).map((p) => (
                <option key={p._id} value={p._id}>
                  {p.displayName || p.username}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => removePlayer(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addPlayer}>
          Add player
        </button>
      </div>
      <div className="match-form__row">
        <label htmlFor="match-winner">Winner (optional)</label>
        <select id="match-winner" value={winnerId} onChange={(e) => setWinnerId(e.target.value)}>
          <option value="">—</option>
          {(players || []).map((p) => (
            <option key={p._id} value={p._id}>
              {p.displayName || p.username}
            </option>
          ))}
        </select>
      </div>
      <div className="match-form__row">
        <label htmlFor="match-score">Score (optional)</label>
        <input
          id="match-score"
          type="text"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="e.g. 2-1"
        />
      </div>
      <div className="match-form__row">
        <label htmlFor="match-notes">Notes (optional)</label>
        <textarea
          id="match-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>
      <div className="match-form__actions">
        <button type="submit">{match ? 'Save' : 'Create'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

MatchForm.propTypes = {
  match: PropTypes.shape({
    gameId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    players: PropTypes.array,
    winnerId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    score: PropTypes.string,
    notes: PropTypes.string,
  }),
  games: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  players: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
      username: PropTypes.string,
      displayName: PropTypes.string,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default MatchForm;
