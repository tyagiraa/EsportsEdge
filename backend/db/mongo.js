const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectToMongo() {
  if (db) return db;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/esportsedge';
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo() first.');
  }
  return db;
}

async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectToMongo,
  getDb,
  closeMongo,
};
