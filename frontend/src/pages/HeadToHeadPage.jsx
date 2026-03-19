import React, { useState, useEffect } from 'react';
import { getPlayers, getHeadToHeadStats } from '../utils/api';
import HeadToHeadForm from '../components/HeadToHeadForm/HeadToHeadForm';
import StatsPanel from '../components/StatsPanel/StatsPanel';

function HeadToHeadPage() {
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState('');
  const [player2Id, setPlayer2Id] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [h2hStats, setH2hStats] = useState(null);

  useEffect(() => {
    getPlayers()
      .then(setPlayers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit() {
    if (!player1Id || !player2Id) return;
    if (player1Id === player2Id) {
      setError('Select two different players.');
      return;
    }
    setError('');
    setH2hStats(null);
    getHeadToHeadStats(player1Id, player2Id)
      .then(setH2hStats)
      .catch((err) => setError(err.message));
  }

  const p1 = players.find((a) => String(a._id) === String(player1Id));
  const p2 = players.find((a) => String(a._id) === String(player2Id));
  const p1Name = p1 ? p1.displayName || p1.username : 'Player 1';
  const p2Name = p2 ? p2.displayName || p2.username : 'Player 2';

  const stats = h2hStats
    ? {
        'Total shared matches': h2hStats.totalShared,
        [p1Name + ' wins']: h2hStats.player1Wins,
        [p2Name + ' wins']: h2hStats.player2Wins,
        ...(h2hStats.draws > 0 ? { Draws: h2hStats.draws } : {}),
      }
    : {};

  return (
    <div>
      <h1>Head-to-Head Stats</h1>
      {error && <p className="page-error">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <HeadToHeadForm
            players={players}
            player1Id={player1Id}
            player2Id={player2Id}
            onPlayer1Change={(v) => {
              setPlayer1Id(v);
              setH2hStats(null);
            }}
            onPlayer2Change={(v) => {
              setPlayer2Id(v);
              setH2hStats(null);
            }}
            onSubmit={handleSubmit}
          />
          {h2hStats && Object.keys(stats).length > 0 && (
            <StatsPanel stats={stats} title={`${p1Name} vs ${p2Name}`} />
          )}
        </>
      )}
    </div>
  );
}

HeadToHeadPage.propTypes = {};

export default HeadToHeadPage;
