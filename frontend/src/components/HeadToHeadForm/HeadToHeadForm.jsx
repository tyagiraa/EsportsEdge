import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import './HeadToHeadForm.css';

function HeadToHeadForm({
  players,
  player1Id,
  player2Id,
  onPlayer1Change,
  onPlayer2Change,
  onSubmit,
}) {
  const [player1Query, setPlayer1Query] = useState('');
  const [player2Query, setPlayer2Query] = useState('');

  const sortedPlayers = useMemo(
    () =>
      [...(players || [])].sort((a, b) =>
        String(a.displayName || a.username || '').localeCompare(
          String(b.displayName || b.username || '')
        )
      ),
    [players]
  );

  const getPlayerLabel = (p) => p.displayName || p.username || String(p._id);

  useEffect(() => {
    const p1 = sortedPlayers.find((p) => String(p._id) === String(player1Id));
    const p2 = sortedPlayers.find((p) => String(p._id) === String(player2Id));
    if (p1) setPlayer1Query(getPlayerLabel(p1));
    if (p2) setPlayer2Query(getPlayerLabel(p2));
  }, [sortedPlayers, player1Id, player2Id]);

  function filteredWithSelected(query, selectedId) {
    const q = query.trim().toLowerCase();
    const base = q
      ? sortedPlayers.filter((p) => getPlayerLabel(p).toLowerCase().includes(q))
      : sortedPlayers;
    if (!selectedId) return base;
    const selected = sortedPlayers.find((p) => String(p._id) === String(selectedId));
    if (selected && !base.some((p) => String(p._id) === String(selectedId))) {
      return [selected, ...base];
    }
    return base;
  }

  const player1Options = filteredWithSelected(player1Query, player1Id);
  const player2Options = filteredWithSelected(player2Query, player2Id);

  function handleQueryChange(value, which) {
    if (which === 'p1') {
      setPlayer1Query(value);
    } else {
      setPlayer2Query(value);
    }
    const exact = sortedPlayers.find(
      (p) => getPlayerLabel(p).toLowerCase() === value.trim().toLowerCase()
    );
    if (exact) {
      if (which === 'p1') onPlayer1Change(String(exact._id));
      else onPlayer2Change(String(exact._id));
    }
  }

  function handleSelectChange(value, which) {
    const selected = sortedPlayers.find((p) => String(p._id) === String(value));
    if (which === 'p1') {
      onPlayer1Change(value);
      setPlayer1Query(selected ? getPlayerLabel(selected) : '');
    } else {
      onPlayer2Change(value);
      setPlayer2Query(selected ? getPlayerLabel(selected) : '');
    }
  }

  return (
    <form
      className="head-to-head-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="head-to-head-form__row">
        <label htmlFor="h2h-player1-search">Find player 1</label>
        <input
          id="h2h-player1-search"
          type="text"
          value={player1Query}
          onChange={(e) => handleQueryChange(e.target.value, 'p1')}
          placeholder="Type player name..."
          list="h2h-player1-options"
          autoComplete="off"
        />
        <datalist id="h2h-player1-options">
          {sortedPlayers.map((p) => (
            <option key={p._id} value={getPlayerLabel(p)} />
          ))}
        </datalist>
      </div>
      <div className="head-to-head-form__row">
        <label htmlFor="h2h-player1">Player 1</label>
        <select
          id="h2h-player1"
          value={player1Id}
          onChange={(e) => handleSelectChange(e.target.value, 'p1')}
          required
        >
          <option value="">Select player</option>
          {player1Options.map((p) => (
            <option key={p._id} value={p._id}>
              {getPlayerLabel(p)}
            </option>
          ))}
        </select>
      </div>
      <div className="head-to-head-form__row">
        <label htmlFor="h2h-player2-search">Find player 2</label>
        <input
          id="h2h-player2-search"
          type="text"
          value={player2Query}
          onChange={(e) => handleQueryChange(e.target.value, 'p2')}
          placeholder="Type player name..."
          list="h2h-player2-options"
          autoComplete="off"
        />
        <datalist id="h2h-player2-options">
          {sortedPlayers.map((p) => (
            <option key={p._id} value={getPlayerLabel(p)} />
          ))}
        </datalist>
      </div>
      <div className="head-to-head-form__row">
        <label htmlFor="h2h-player2">Player 2</label>
        <select
          id="h2h-player2"
          value={player2Id}
          onChange={(e) => handleSelectChange(e.target.value, 'p2')}
          required
        >
          <option value="">Select player</option>
          {player2Options.map((p) => (
            <option key={p._id} value={p._id}>
              {getPlayerLabel(p)}
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
