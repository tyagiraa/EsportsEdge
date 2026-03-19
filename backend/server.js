require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { connectToMongo } = require('./db/mongo');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./auth/passport');
const playersRouter = require('./routes/players');
const gamesRouter = require('./routes/games');
const matchesRouter = require('./routes/matches');
const statsRouter = require('./routes/stats');
const authRouter = require('./routes/auth');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
  },
};

if (process.env.USE_MONGO_SESSION_STORE === 'true') {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/esportsedge',
  });
}

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/players', playersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/stats', statsRouter);

app.get('/api/build-info', (req, res) => {
  res.json({
    ok: true,
    authRoutesMounted: true,
    feature: 'passport-session',
  });
});

app.get('/api/session-test', (req, res) => {
  req.session.touch();
  req.session.testValue = String(Date.now());
  return res.json({
    ok: true,
    sessionID: req.sessionID,
    testValue: req.session.testValue,
  });
});

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
