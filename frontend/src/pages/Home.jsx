import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h1>EsportsEdge</h1>
      <p>Track matches and stats for casual and competitive esports.</p>
      <ul>
        <li><Link to="/players">Players</Link> – manage player profiles</li>
        <li><Link to="/games">Games</Link> – manage game titles</li>
        <li><Link to="/matches">Matches</Link> – log and browse matches</li>
        <li><Link to="/head-to-head">Head to Head</Link> – compare two players</li>
      </ul>
    </div>
  );
}

Home.propTypes = {};

export default Home;
