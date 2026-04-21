import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { auth } = useAuth();

  return (
    <div className="home">
      <h1>EsportsEdge</h1>
      <p>Track match results and stats for casual and competitive esports players.</p>

      <section className="home-instructions">
        <h2>How to use</h2>
        <ol className="home-steps">
          <li>
            <strong>Create an account</strong> — click{' '}
            {auth ? (
              'Register'
            ) : (
              <Link to="/register">Register</Link>
            )}{' '}
            in the nav bar. You will be logged in automatically.
          </li>
          <li>
            <strong>Add games</strong> — go to{' '}
            <Link to="/games">Games</Link> and click <em>Add game</em> to create the game titles
            you play.
          </li>
          <li>
            <strong>Log matches</strong> — go to{' '}
            <Link to="/matches">Matches</Link> and click <em>Add match</em>. Select the game,
            date, players, and optionally the winner and score.
          </li>
          <li>
            <strong>View player stats</strong> — go to{' '}
            <Link to="/players">Players</Link> and click a player&rsquo;s name to see their win
            rate, total matches, wins, and losses.
          </li>
          <li>
            <strong>Compare two players</strong> — go to{' '}
            <Link to="/head-to-head">Head-to-Head</Link>, select any two players, and click{' '}
            <em>Compare</em> to see their shared match history and wins.
          </li>
          <li>
            <strong>Filter match history</strong> — on the{' '}
            <Link to="/matches">Matches</Link> page, use the filters at the top to narrow results
            by game, player name, date, or year.
          </li>
        </ol>
      </section>

      <section>
        <h2>Pages</h2>
        <ul>
          <li>
            <Link to="/players">Players</Link> &mdash; browse all player profiles and stats
          </li>
          <li>
            <Link to="/games">Games</Link> &mdash; manage game titles
          </li>
          <li>
            <Link to="/matches">Matches</Link> &mdash; log and browse match history
          </li>
          <li>
            <Link to="/head-to-head">Head-to-Head</Link> &mdash; compare two players
          </li>
        </ul>
      </section>
    </div>
  );
}

Home.propTypes = {};

export default Home;
