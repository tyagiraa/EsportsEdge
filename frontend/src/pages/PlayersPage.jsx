import React, { useState, useEffect, useMemo } from 'react';
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../utils/api';
import PlayerCard from '../components/PlayerCard/PlayerCard';
import PlayerForm from '../components/PlayerForm/PlayerForm';
import { useAuth } from '../context/AuthContext';

function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const { auth, loading: authLoading } = useAuth();

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = q
      ? players.filter(
          (p) =>
            (p.displayName || '').toLowerCase().includes(q) ||
            (p.username || '').toLowerCase().includes(q)
        )
      : [...players];

    if (sortBy === 'name-asc') {
      result.sort((a, b) =>
        (a.displayName || a.username || '').localeCompare(b.displayName || b.username || '')
      );
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) =>
        (b.displayName || b.username || '').localeCompare(a.displayName || a.username || '')
      );
    }
    return result;
  }, [players, search, sortBy]);

  function canEdit(p) {
    return auth && String(auth.player?._id) === String(p._id);
  }

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
    if (!window.confirm('Delete this player? This cannot be undone.')) return;
    deletePlayer(id)
      .then(() => load())
      .catch((err) => setError(err.message));
  }

  return (
    <div>
      <h1>
        Players
        {!loading && (
          <span className="page-count">
            {search ? `${filtered.length} / ${players.length}` : players.length}
          </span>
        )}
      </h1>
      {error && <p className="page-error">{error}</p>}
      {!authLoading && !auth && (
        <p className="page-error">Login required to create or edit players.</p>
      )}
      {loading ? (
        <p>Loading&hellip;</p>
      ) : (
        <>
          <div className="list-controls">
            <input
              type="search"
              className="search-input"
              placeholder="Search by name or username&hellip;"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search players"
            />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort players"
            >
              <option value="name-asc">Name A &ndash; Z</option>
              <option value="name-desc">Name Z &ndash; A</option>
            </select>
            {auth && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(true);
                  setEditing(null);
                }}
              >
                Add player
              </button>
            )}
          </div>

          {auth && showForm && !editing && (
            <section className="form-section">
              <h2>New player</h2>
              <PlayerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
            </section>
          )}
          {auth && editing && (
            <section className="form-section">
              <h2>Edit player</h2>
              <PlayerForm
                player={editing}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            </section>
          )}

          {filtered.length === 0 && search && (
            <p className="muted">No players match &ldquo;{search}&rdquo;.</p>
          )}

          <ul className="card-list">
            {filtered.map((p) => (
              <li key={p._id}>
                <PlayerCard player={p} />
                {canEdit(p) && (
                  <div className="item-actions">
                    <button type="button" onClick={() => setEditing(p)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
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
