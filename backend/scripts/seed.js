/**
 * Seed script: populates DB with 100 players, 20 games, 1001 matches.
 * Run: npm run seed (from backend directory).
 */
require('dotenv').config();
const { connectToMongo, getDb, closeMongo } = require('../db/mongo');

const GAME_NAMES = [
  'Valorant', 'League of Legends', 'Counter-Strike 2', 'Dota 2', 'Overwatch 2',
  'Rocket League', 'FIFA 24', 'Apex Legends', 'Fortnite', 'Street Fighter 6',
  'Tekken 8', 'Super Smash Bros', 'Hearthstone', 'StarCraft II', 'Rainbow Six Siege',
  'Call of Duty', 'Minecraft', 'Among Us', 'Fall Guys', 'Brawlhalla',
];
const GENRES = ['FPS', 'MOBA', 'Battle Royale', 'Fighting', 'Sports', 'Strategy', 'Card'];
const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Cross-platform'];
const DEVELOPERS = ['Riot', 'Valve', 'Blizzard', 'Epic', 'EA', 'Nintendo', 'Ubisoft', null];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinDays(daysAgo) {
  const now = Date.now();
  const past = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

async function seed() {
  await connectToMongo();
  const db = getDb();
  const playersCol = db.collection('players');
  const gamesCol = db.collection('games');
  const matchesCol = db.collection('matches');

  await playersCol.deleteMany({});
  await gamesCol.deleteMany({});
  await matchesCol.deleteMany({});

  const playerIds = [];
  for (let i = 0; i < 100; i++) {
    const u = `player${i + 1}`;
    const doc = {
      username: u,
      displayName: `Player ${i + 1}`,
      email: `${u}@example.com`,
      favoriteGame: pick(GAME_NAMES),
      bio: i % 3 === 0 ? `Bio for ${u}` : null,
      createdAt: new Date(),
    };
    const result = await playersCol.insertOne(doc);
    playerIds.push(result.insertedId);
  }
  console.log(`Inserted ${playerIds.length} players.`);

  const gameIds = [];
  const usedNames = new Set();
  for (let i = 0; i < 20; i++) {
    let name = pick(GAME_NAMES);
    while (usedNames.has(name)) name = pick(GAME_NAMES);
    usedNames.add(name);
    const doc = {
      name,
      genre: pick(GENRES),
      platform: pick(PLATFORMS),
      developer: pick(DEVELOPERS),
      createdAt: new Date(),
    };
    const result = await gamesCol.insertOne(doc);
    gameIds.push(result.insertedId);
  }
  console.log(`Inserted ${gameIds.length} games.`);

  for (let i = 0; i < 1001; i++) {
    const numPlayers = Math.random() > 0.2 ? 2 : 2 + Math.floor(Math.random() * 2);
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
    const players = shuffled.slice(0, numPlayers).map((id) => id);
    const winnerId = Math.random() > 0.1 ? pick(players) : null;
    const doc = {
      gameId: pick(gameIds),
      date: randomDateWithinDays(365),
      players,
      winnerId,
      score: winnerId && Math.random() > 0.5 ? '2-1' : null,
      notes: Math.random() > 0.8 ? 'Seed match' : null,
      createdAt: new Date(),
    };
    await matchesCol.insertOne(doc);
  }
  console.log('Inserted 1001 matches.');

  await closeMongo();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
