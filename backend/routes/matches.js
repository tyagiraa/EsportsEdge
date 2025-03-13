const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { gameId, date, players, winnerId, score, notes } = req.body;
    if (!gameId || !date || !Array.isArray(players)) {
      return res.status(400).json({ error: 'gameId, date, and players (array) are required' });
    }
    const doc = {
      gameId: ObjectId.isValid(gameId) ? new ObjectId(gameId) : gameId,
      date: new Date(date),
      players: players.map((p) => (ObjectId.isValid(p) ? new ObjectId(p) : p)),
      winnerId: winnerId && ObjectId.isValid(winnerId) ? new ObjectId(winnerId) : winnerId || null,
      score: score || null,
      notes: notes || null,
      createdAt: new Date(),
    };
    const result = await db.collection('matches').insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const { gameId, date } = req.query;
    const filter = {};
    if (gameId && ObjectId.isValid(gameId)) {
      filter.gameId = new ObjectId(gameId);
    }
    if (date && typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const dayStart = new Date(date + 'T00:00:00.000Z');
      const dayEnd = new Date(dayStart);
      dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
      filter.date = { $gte: dayStart, $lt: dayEnd };
    }
    const list = await db
      .collection('matches')
      .find(filter)
      .sort({ date: -1 })
      .toArray();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid match id' });
    }
    const doc = await db.collection('matches').findOne({ _id: new ObjectId(req.params.id) });
    if (!doc) return res.status(404).json({ error: 'Match not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch match' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid match id' });
    }
    const { gameId, date, players, winnerId, score, notes } = req.body;
    const update = {};
    if (gameId !== undefined) update.gameId = ObjectId.isValid(gameId) ? new ObjectId(gameId) : gameId;
    if (date !== undefined) update.date = new Date(date);
    if (players !== undefined) update.players = players.map((p) => (ObjectId.isValid(p) ? new ObjectId(p) : p));
    if (winnerId !== undefined) update.winnerId = winnerId && ObjectId.isValid(winnerId) ? new ObjectId(winnerId) : winnerId;
    if (score !== undefined) update.score = score;
    if (notes !== undefined) update.notes = notes;
    const result = await db.collection('matches').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }
    const doc = await db.collection('matches').findOne({ _id: new ObjectId(req.params.id) });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid match id' });
    }
    const result = await db.collection('matches').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Match not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

module.exports = router;
