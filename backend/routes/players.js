const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { username, displayName, email, favoriteGame, bio } = req.body;
    if (!username || !displayName || !email) {
      return res.status(400).json({ error: 'username, displayName, and email are required' });
    }
    const doc = {
      username,
      displayName,
      email,
      favoriteGame: favoriteGame || null,
      bio: bio || null,
      createdAt: new Date(),
    };
    const result = await db.collection('players').insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const list = await db.collection('players').find({}).toArray();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }
    const playerId = new ObjectId(req.params.id);
    const doc = await db.collection('players').findOne({ _id: playerId });
    if (!doc) return res.status(404).json({ error: 'Player not found' });

    const matchesCol = db.collection('matches');
    const totalMatches = await matchesCol.countDocuments({ players: playerId });
    const wins = await matchesCol.countDocuments({ winnerId: playerId });
    const losses = totalMatches - wins;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 1000) / 10 : 0;

    res.json({
      ...doc,
      stats: { totalMatches, wins, losses, winRate },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }
    const { username, displayName, email, favoriteGame, bio } = req.body;
    const update = {};
    if (username !== undefined) update.username = username;
    if (displayName !== undefined) update.displayName = displayName;
    if (email !== undefined) update.email = email;
    if (favoriteGame !== undefined) update.favoriteGame = favoriteGame;
    if (bio !== undefined) update.bio = bio;
    const result = await db.collection('players').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    const doc = await db.collection('players').findOne({ _id: new ObjectId(req.params.id) });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }
    const result = await db.collection('players').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Player not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

module.exports = router;
