const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const db = getDb();
    const { username, password, displayName, email, favoriteGame, bio } = req.body || {};
    if (!username || !password || !displayName || !email) {
      return res
        .status(400)
        .json({ error: 'username, password, displayName, and email are required' });
    }

    const normalizedUsername = String(username).toLowerCase();
    const existingUser = await db.collection('users').findOne({ username: normalizedUsername });
    if (existingUser) return res.status(409).json({ error: 'Username already exists' });

    const passwordHash = await bcrypt.hash(String(password), 10);
    const userResult = await db.collection('users').insertOne({
      username: normalizedUsername,
      passwordHash,
      createdAt: new Date(),
    });

    const userId = userResult.insertedId;
    const playerResult = await db.collection('players').insertOne({
      username: normalizedUsername,
      displayName: String(displayName),
      email: String(email),
      favoriteGame: favoriteGame || null,
      bio: bio || null,
      userId,
      createdAt: new Date(),
    });

    req.logIn({ _id: userId, username: normalizedUsername }, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: 'Login failed' });
      return res.status(201).json({
        user: { _id: userId, username: normalizedUsername },
        player: { _id: playerResult.insertedId, username: normalizedUsername, displayName, email },
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ ok: true });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    return res.json({ ok: true });
  });
});

router.get('/me', async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.json({ user: null, player: null });
    }

    const db = getDb();
    const user = req.user;
    const player = await db.collection('players').findOne({ userId: user._id });
    if (!player)
      return res.json({ user: { _id: user._id, username: user.username }, player: null });

    const matchesCol = db.collection('matches');
    const playerId = player._id;
    const totalMatches = await matchesCol.countDocuments({ players: playerId });
    const wins = await matchesCol.countDocuments({ winnerId: playerId });
    const losses = totalMatches - wins;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 1000) / 10 : 0;

    return res.json({
      user: { _id: user._id, username: user.username },
      player: {
        ...player,
        stats: { totalMatches, wins, losses, winRate },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

router.param('id', (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
  return next();
});

module.exports = router;
