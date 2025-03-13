const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const { name, genre, platform, developer } = req.body;
    if (!name || !genre || !platform) {
      return res.status(400).json({ error: 'name, genre, and platform are required' });
    }
    const doc = {
      name,
      genre,
      platform,
      developer: developer || null,
      createdAt: new Date(),
    };
    const result = await db.collection('games').insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const list = await db.collection('games').find({}).toArray();
    const counts = await db.collection('matches').aggregate([
      { $group: { _id: '$gameId', count: { $sum: 1 } } },
    ]).toArray();
    const countMap = {};
    counts.forEach((c) => { countMap[c._id.toString()] = c.count; });
    list.forEach((g) => {
      g.matchCount = countMap[g._id.toString()] ?? 0;
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }
    const gameId = new ObjectId(req.params.id);
    const doc = await db.collection('games').findOne({ _id: gameId });
    if (!doc) return res.status(404).json({ error: 'Game not found' });
    const matchCount = await db.collection('matches').countDocuments({ gameId });
    res.json({ ...doc, matchCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }
    const { name, genre, platform, developer } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (genre !== undefined) update.genre = genre;
    if (platform !== undefined) update.platform = platform;
    if (developer !== undefined) update.developer = developer;
    const result = await db.collection('games').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const doc = await db.collection('games').findOne({ _id: new ObjectId(req.params.id) });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }
    const result = await db.collection('games').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Game not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

module.exports = router;
