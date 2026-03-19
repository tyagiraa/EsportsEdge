import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatch, getGames, getPlayers, updateMatch, deleteMatch } from '../utils/api';
import MatchForm from '../components/MatchForm/MatchForm';
import { useAuth } from '../context/AuthContext';

function nameById(arr, id) {
  if (!id || !arr) return '';
  const strId = String(id);
  const item = arr.find((a) => String(a._id) === strId);
  return item ? item.displayName || item.username || item.name : strId;
}

function MatchDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const { auth, loading: authLoading } = useAuth();

  useEffect(() => {
    Promise.all([getMatch(id), getGames(), getPlayers()])
      .then(([m, g, p]) => {
        setMatch(m);
        setGames(g);
        setPlayers(p);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleUpdate(values) {
    updateMatch(id, values)
      .then((updated) => {
        setMatch(updated);
        setEditing(false);
      })
      .catch((err) => setError(err.message));
  }

  function handleDelete() {
    if (!window.confirm('Delete this match?')) return;
    deleteMatch(id)
      .then(() => navigate('/matches'))
      .catch((err) => setError(err.message));
  }

  if (loading) return <p>Loading…</p>;
  if (error && !match) return <p className="page-error">{error}</p>;
  if (!match) return <p>Match not found.</p>;

  const gameName = nameById(games, match.gameId);
  const playerNames = (match.players || []).map((pid) => nameById(players, pid));
  const winnerName = nameById(players, match.winnerId);
  const dateStr = match.date ? new Date(match.date).toLocaleString() : '—';

  return (
    <div>
      <h1>Match details</h1>
      {error && <p className="page-error">{error}</p>}
      <p>
        <strong>{gameName || 'Game'}</strong>
      </p>
      <p className="muted">Date: {dateStr}</p>
      {playerNames.length > 0 && <p>Players: {playerNames.join(', ')}</p>}
      {winnerName && <p>Winner: {winnerName}</p>}
      {match.score && <p>Score: {match.score}</p>}
      {match.notes && <p>Notes: {match.notes}</p>}
      {!authLoading && !auth ? (
        <p className="page-error">Login required to edit or delete this match.</p>
      ) : (
        <>
          <div className="item-actions" style={{ marginBottom: '1rem' }}>
            <button type="button" onClick={() => setEditing(!editing)}>
              {editing ? 'Cancel edit' : 'Edit'}
            </button>
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
          </div>
          {editing && (
            <MatchForm
              match={match}
              games={games}
              players={players}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

MatchDetailsPage.propTypes = {};

export default MatchDetailsPage;
