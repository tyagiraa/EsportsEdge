require('dotenv').config();
const express = require('express');
const { connectToMongo } = require('./db/mongo');
const playersRouter = require('./routes/players');
const gamesRouter = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/players', playersRouter);
app.use('/api/games', gamesRouter);

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