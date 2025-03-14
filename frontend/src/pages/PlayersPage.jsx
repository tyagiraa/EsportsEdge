import React, { useState, useEffect } from 'react';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../utils/api';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import PlayerForm from '../components/PlayerForm/PlayerForm';

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (err) {
      setError(err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleCreate(values) {
    createPlayer(values)
      .then(() => {
        setShowForm(false);
        load();
      })
      .catch((err) => setError(err.message));
  }

  function handleUpdate(values) {
    if (!editing) return;
    updatePlayer(editing._id, values)
      .then(() => {
        setEditing(null);
        load();
      })
      .catch((err) => setError(err.message));
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this player?')) return;
    deletePlayer(id)
      .then(() => load())
      .catch((err) => setError(err.message));
  }

  return (
    <div>
      <h1>Players</h1>
      {error && <p className="page-error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <p>
            <button type="button" onClick={() => { setShowForm(true); setEditing(null); }}>
              Add player
            </button>
          </p>
          {showForm && !editing && (
            <section className="form-section">
              <h2>New player</h2>
              <PlayerForm
                onSubmit={handleCreate}
                onCancel={() => setShowForm(false)}
              />
            </section>
          )}
          {editing && (
            <section className="form-section">
              <h2>Edit player</h2>
              <PlayerForm
                player={editing}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            </section>
          )}
          <ul className="card-list">
            {players.map((p) => (
              <li key={p._id}>
                <PlayerCard player={p} />
                <div className="item-actions">
                  <button type="button" onClick={() => setEditing(p)}>Edit</button>
                  <button type="button" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

PlayersPage.propTypes = {};

export default PlayersPage;
