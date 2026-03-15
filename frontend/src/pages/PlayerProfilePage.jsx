import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayer, updatePlayer, deletePlayer } from '../utils/api';
import PlayerForm from '../components/PlayerForm/PlayerForm';
import StatsPanel from '../components/StatsPanel/StatsPanel';

function PlayerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getPlayer(id)
      .then(setPlayer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleUpdate(values) {
    updatePlayer(id, values)
      .then((updated) => {
        setPlayer(updated);
        setEditing(false);
      })
      .catch((err) => setError(err.message));
  }

  function handleDelete() {
    if (!window.confirm('Delete this player?')) return;
    deletePlayer(id)
      .then(() => navigate('/players'))
      .catch((err) => setError(err.message));
  }

  if (loading) return <p>Loading…</p>;
  if (error && !player) return <p className="page-error">{error}</p>;
  if (!player) return <p>Player not found.</p>;

  const s = player.stats || {};
  const stats = {
    'Total matches': s.totalMatches ?? 0,
    'Wins': s.wins ?? 0,
    'Losses': s.losses ?? 0,
    'Win rate': `${s.winRate ?? 0}%`,
  };

  return (
    <div>
      <h1>{player.displayName || player.username}</h1>
      {error && <p className="page-error">{error}</p>}
      <p className="muted">@{player.username}</p>
      {player.bio && <p>{player.bio}</p>}
      {player.favoriteGame && <p>Favorite game: {player.favoriteGame}</p>}
      <StatsPanel stats={stats} title="Stats" />
      <div className="item-actions" style={{ marginBottom: '1rem' }}>
        <button type="button" onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel edit' : 'Edit'}
        </button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </div>
      {editing && (
        <PlayerForm
          player={player}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}

PlayerProfilePage.propTypes = {};

export default PlayerProfilePage;
