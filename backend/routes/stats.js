const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

const router = express.Router();

router.get('/head-to-head', async (req, res) => {
  try {
    const { player1, player2 } = req.query;
    if (!player1 || !player2) {
      return res.status(400).json({ error: 'Query params player1 and player2 are required' });
    }
    if (!ObjectId.isValid(player1) || !ObjectId.isValid(player2)) {
      return res.status(400).json({ error: 'Invalid player id' });
    }
    const id1 = new ObjectId(player1);
    const id2 = new ObjectId(player2);
    if (id1.equals(id2)) {
      return res.status(400).json({ error: 'Player 1 and Player 2 must be different' });
    }

    const db = getDb();
    const shared = await db.collection('matches').find({
      players: { $all: [id1, id2] },
    }).toArray();

    let player1Wins = 0;
    let player2Wins = 0;
    shared.forEach((m) => {
      if (m.winnerId && m.winnerId.equals(id1)) player1Wins += 1;
      else if (m.winnerId && m.winnerId.equals(id2)) player2Wins += 1;
    });
    const draws = shared.length - player1Wins - player2Wins;

    res.json({
      totalShared: shared.length,
      player1Wins,
      player2Wins,
      draws,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute head-to-head stats' });
  }
});

module.exports = router;
