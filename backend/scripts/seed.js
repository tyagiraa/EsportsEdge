require('dotenv').config();
const { connectToMongo, getDb, closeMongo } = require('../db/mongo');
const bcrypt = require('bcryptjs');

const DEFAULT_PASSWORD = 'password123';
const PLAYER_COUNT = 1300;
const GAME_COUNT = 20;
const MATCH_COUNT = 1300;

const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Riley',
  'Casey',
  'Avery',
  'Skyler',
  'Quinn',
  'Cameron',
  'Rowan',
  'Parker',
  'Reese',
  'Logan',
  'Kai',
  'Noah',
  'Liam',
  'Ethan',
  'Mason',
  'Aiden',
  'Emma',
  'Olivia',
  'Ava',
  'Sophia',
  'Mia',
  'Charlotte',
  'Amelia',
  'Harper',
  'Ella',
  'Nora',
];

const LAST_NAMES = [
  'Sharma',
  'Patel',
  'Singh',
  'Kim',
  'Chen',
  'Nguyen',
  'Smith',
  'Brown',
  'Garcia',
  'Martinez',
  'Wilson',
  'Anderson',
  'Thomas',
  'White',
  'Harris',
  'Martin',
  'Clark',
  'Lewis',
  'Walker',
  'Hall',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Green',
  'Baker',
  'Adams',
  'Nelson',
  'Carter',
];

const GAME_NAMES = [
  'Valorant',
  'League of Legends',
  'Counter-Strike 2',
  'Dota 2',
  'Overwatch 2',
  'Rocket League',
  'FIFA 24',
  'Apex Legends',
  'Fortnite',
  'Street Fighter 6',
  'Tekken 8',
  'Super Smash Bros',
  'Hearthstone',
  'StarCraft II',
  'Rainbow Six Siege',
  'Call of Duty',
  'Minecraft',
  'Among Us',
  'Fall Guys',
  'Brawlhalla',
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

function createRandomPlayerIdentity(index) {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const displayName = `${first} ${last}`;
  const username = `${first}.${last}.${index + 1}`.toLowerCase();
  return { username, displayName };
}

async function seed() {
  await connectToMongo();
  const db = getDb();
  const playersCol = db.collection('players');
  const usersCol = db.collection('users');
  const gamesCol = db.collection('games');
  const matchesCol = db.collection('matches');

  await playersCol.deleteMany({});
  await usersCol.deleteMany({});
  await gamesCol.deleteMany({});
  await matchesCol.deleteMany({});

  const playerIds = [];
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const identity = createRandomPlayerIdentity(i);
    const u = identity.username;
    const userResult = await usersCol.insertOne({
      username: u,
      passwordHash,
      createdAt: new Date(),
    });
    const userId = userResult.insertedId;
    const doc = {
      username: u,
      displayName: identity.displayName,
      email: `${u}@example.com`,
      favoriteGame: pick(GAME_NAMES),
      bio: i % 3 === 0 ? `Bio for ${u}` : null,
      userId,
      createdAt: new Date(),
    };
    const result = await playersCol.insertOne(doc);
    playerIds.push(result.insertedId);
  }
  console.log(`Inserted ${playerIds.length} players.`);

  const gameIds = [];
  const usedNames = new Set();
  for (let i = 0; i < GAME_COUNT; i++) {
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

  for (let i = 0; i < MATCH_COUNT; i++) {
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
  console.log(`Inserted ${MATCH_COUNT} matches.`);

  await closeMongo();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
