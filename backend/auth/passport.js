const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/mongo');

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const db = getDb();
        const user = await db
          .collection('users')
          .findOne({ username: String(username).toLowerCase() });
        if (!user) return done(null, false);
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDb();
    const userId = typeof id === 'string' ? new ObjectId(id) : id;
    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
