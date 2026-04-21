import React, { useState, useEffect, useMemo } from 'react';
import { getGames, createGame, updateGame, deleteGame } from '../utils/api';
import GameCard from '../components/GameCard/GameCard';
import GameForm from '../components/GameForm/GameForm';
import { useAuth } from '../context/AuthContext';

function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const { auth, loading: authLoading } = useAuth();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getGames();
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setGames(sorted);
    } catch (err) {
      setError(err.message || 'Failed to load games');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) =>
        (g.name || '').toLowerCase().includes(q) ||
        (g.genre || '').toLowerCase().includes(q) ||
        (g.platform || '').toLowerCase().includes(q)
    );
  }, [games, search]);

  function handleCreate(values) {
    createGame(values)
      .then(() => {
        setShowForm(false);
        load();
      })
      .catch((err) => setError(err.message));
  }

  function handleUpdate(values) {
    if (!editing) return;
    updateGame(editing._id, values)
      .then(() => {
        setEditing(null);
        load();
      })
      .catch((err) => setError(err.message));
  }

  function handleDelete(id) {
    if (
      !window.confirm(
        'Delete this game? All matches for this game will also be deleted. This cannot be undone.'
      )
    )
      return;
    deleteGame(id)
      .then(() => load())
      .catch((err) => setError(err.message));
  }

  return (
    <div>
      <h1>
        Games
        {!loading && (
          <span className="page-count">
            {search ? `${filtered.length} / ${games.length}` : games.length}
          </span>
        )}
      </h1>
      {error && <p className="page-error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          {!authLoading && !auth && (
            <p className="page-error">Login required to create, edit, or delete games.</p>
          )}
          <div className="list-controls">
            <input
              type="search"
              className="search-input"
              placeholder="Search by name, genre, or platform…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search games"
            />
            {auth && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(true);
                  setEditing(null);
                }}
              >
                Add game
              </button>
            )}
          </div>

          {auth && showForm && !editing && (
            <section className="form-section">
              <h2>New game</h2>
              <GameForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
            </section>
          )}
          {auth && editing && (
            <section className="form-section">
              <h2>Edit game</h2>
              <GameForm game={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
            </section>
          )}

          {filtered.length === 0 && search && (
            <p className="muted">No games match &ldquo;{search}&rdquo;.</p>
          )}

          <ul className="card-list">
            {filtered.map((g) => (
              <li key={g._id}>
                <GameCard game={g} />
                {auth && (
                  <div className="item-actions">
                    <button type="button" onClick={() => setEditing(g)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(g._id)}
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

GamesPage.propTypes = {};

export default GamesPage;
