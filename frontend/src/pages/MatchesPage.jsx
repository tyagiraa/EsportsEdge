import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getMatches,
  getGames,
  getPlayers,
  createMatch,
  updateMatch,
  deleteMatch,
} from '../utils/api';
import MatchCard from '../components/MatchCard/MatchCard';
import MatchForm from '../components/MatchForm/MatchForm';
import { useAuth } from '../context/AuthContext';
import BackToTopButton from '../components/BackToTopButton/BackToTopButton';

function nameById(arr, id) {
  if (!id || !arr) return '';
  const strId = String(id);
  const item = arr.find((a) => String(a._id) === strId);
  return item ? item.displayName || item.username || item.name : strId;
}

function MatchesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterGameId, setFilterGameId] = useState(searchParams.get('gameId') || '');
  const [filterDate, setFilterDate] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const { auth, loading: authLoading } = useAuth();

  async function loadGamesAndPlayers() {
    setError('');
    try {
      const [gameList, playerList] = await Promise.all([getGames(), getPlayers()]);
      setGames(gameList);
      setPlayers(playerList);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    }
  }

  async function loadMatches() {
    setLoading(true);
    setError('');
    try {
      const filters = {};
      if (filterGameId) filters.gameId = filterGameId;
      if (filterDate) {
        filters.date = filterDate;
      } else if (filterYear) {
        filters.year = filterYear;
        if (filterMonth) filters.month = filterMonth;
      }
      const matchList = await getMatches(filters);
      setMatches(matchList);
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGamesAndPlayers();
  }, []);

  useEffect(() => {
    loadMatches();
  }, [filterGameId, filterDate, filterYear, filterMonth]);

  useEffect(() => {
    const urlGameId = searchParams.get('gameId') || '';
    if (urlGameId && urlGameId !== filterGameId) {
      setFilterGameId(urlGameId);
    }
  }, [searchParams, filterGameId]);

  const filteredMatches = useMemo(() => {
    const q = playerSearch.trim().toLowerCase();
    if (!q) return matches;
    return matches.filter((m) =>
      (m.players || []).some((pid) => nameById(players, pid).toLowerCase().includes(q))
    );
  }, [matches, players, playerSearch]);

  const gamesSortedByName = useMemo(
    () =>
      [...games].sort((a, b) =>
        String(a.name || '').localeCompare(String(b.name || ''), undefined, { sensitivity: 'base' })
      ),
    [games]
  );

  function handleCreate(values) {
    createMatch(values)
      .then(() => {
        setShowForm(false);
        loadMatches();
      })
      .catch((err) => setError(err.message));
  }

  function handleUpdate(values) {
    if (!editing) return;
    updateMatch(editing._id, values)
      .then(() => {
        setEditing(null);
        loadMatches();
      })
      .catch((err) => setError(err.message));
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this match?')) return;
    deleteMatch(id)
      .then(() => loadMatches())
      .catch((err) => setError(err.message));
  }

  function handleClearFilters() {
    setFilterGameId('');
    setFilterDate('');
    setFilterYear('');
    setFilterMonth('');
    setPlayerSearch('');
    setSearchParams({});
  }

  return (
    <div>
      <h1>
        Matches
        {!loading && (
          <span className="page-count">
            {playerSearch || filterGameId || filterDate || filterYear
              ? `${filteredMatches.length} / ${matches.length}`
              : matches.length}
          </span>
        )}
      </h1>
      <p className="page-subtitle">
        Log match results here. Use filters to browse history by game, player, or date.
      </p>
      {error && <p className="page-error">{error}</p>}
      {!authLoading && !auth && (
        <p className="page-error">Login required to create, edit, or delete matches.</p>
      )}
      {loading && !games.length ? (
        <p>Loading&hellip;</p>
      ) : (
        <>
          <section className="matches-filters" aria-label="Filter matches">
            <div className="matches-filters__field matches-filters__field--game">
              <label htmlFor="filter-game">Game</label>
              <select
                id="filter-game"
                value={filterGameId}
                onChange={(e) => setFilterGameId(e.target.value)}
              >
                <option value="">All games</option>
                {gamesSortedByName.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="matches-filters__field matches-filters__field--player">
              <label htmlFor="filter-player">Player</label>
              <input
                id="filter-player"
                type="search"
                placeholder="Player name&hellip;"
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                aria-label="Filter by player name"
              />
            </div>

            <div className="matches-filters__field matches-filters__field--date">
              <label htmlFor="filter-date">Date</label>
              <input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="matches-filters__field matches-filters__field--year">
              <label htmlFor="filter-year">Year</label>
              <input
                id="filter-year"
                type="number"
                min="1970"
                max="2100"
                placeholder="YYYY"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              />
            </div>

            <div className="matches-filters__field matches-filters__field--month">
              <label htmlFor="filter-month">Month</label>
              <select
                id="filter-month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                disabled={!filterYear}
              >
                <option value="">All months</option>
                <option value="1">Jan</option>
                <option value="2">Feb</option>
                <option value="3">Mar</option>
                <option value="4">Apr</option>
                <option value="5">May</option>
                <option value="6">Jun</option>
                <option value="7">Jul</option>
                <option value="8">Aug</option>
                <option value="9">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
              </select>
            </div>

            <div className="matches-filters__field matches-filters__field--clear">
              <span className="matches-filters__label-spacer" aria-hidden="true">
                &#160;
              </span>
              <button type="button" onClick={handleClearFilters}>
                Clear filters
              </button>
            </div>
          </section>

          {auth && (
            <div className="add-match-bar">
              <button
                type="button"
                className="btn-add-match"
                onClick={() => {
                  setShowForm(true);
                  setEditing(null);
                }}
              >
                + Log a match
              </button>
              <span className="add-match-hint">
                Select a game, add the players who participated, and optionally set a winner.
              </span>
            </div>
          )}

          {auth && showForm && !editing && (
            <section className="form-section">
              <h2>Log a new match</h2>
              <MatchForm
                games={games}
                players={players}
                currentPlayerId={auth?.player?._id}
                onSubmit={handleCreate}
                onCancel={() => setShowForm(false)}
              />
            </section>
          )}
          {auth && editing && (
            <section className="form-section">
              <h2>Edit match</h2>
              <MatchForm
                match={editing}
                games={games}
                players={players}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            </section>
          )}

          {loading ? (
            <p>Loading matches&hellip;</p>
          ) : (
            <>
              {filteredMatches.length === 0 && playerSearch && (
                <p className="muted">No matches found for player &ldquo;{playerSearch}&rdquo;.</p>
              )}
              <ul className="card-list">
                {filteredMatches.map((m) => {
                  const gameName = nameById(games, m.gameId);
                  const playerNames = (m.players || []).map((pid) => nameById(players, pid));
                  const winnerName = nameById(players, m.winnerId);
                  return (
                    <li key={m._id}>
                      <MatchCard
                        match={m}
                        gameName={gameName}
                        playerNames={playerNames}
                        winnerName={winnerName}
                      />
                      {auth && (
                        <div className="item-actions">
                          <button type="button" onClick={() => setEditing(m)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => handleDelete(m._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}
      <BackToTopButton />
    </div>
  );
}

MatchesPage.propTypes = {};

export default MatchesPage;
