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
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: true,
    store:
      process.env.USE_MONGO_SESSION_STORE === 'true'
        ? MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/esportsedge',
          })
        : undefined,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

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
