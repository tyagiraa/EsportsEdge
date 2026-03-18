require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { connectToMongo } = require('./db/mongo');
const playersRouter = require('./routes/players');
const gamesRouter = require('./routes/games');
const matchesRouter = require('./routes/matches');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/players', playersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/stats', statsRouter);

// Serve the production React build from `backend/dist`.
// This makes client-side routes (React Router) work under the same domain as the API.
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    return res.sendFile(path.join(distDir, 'index.html'));
  });
}

async function start() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`EsportsEdge API running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
