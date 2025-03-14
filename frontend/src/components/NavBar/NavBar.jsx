import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__link" end>
        Home
      </NavLink>
      <NavLink to="/players" className="navbar__link">
        Players
      </NavLink>
      <NavLink to="/games" className="navbar__link">
        Games
      </NavLink>
      <NavLink to="/matches" className="navbar__link">
        Matches
      </NavLink>
      <NavLink to="/head-to-head" className="navbar__link">
        Head-to-Head
      </NavLink>
    </nav>
  );
}

NavBar.propTypes = {};

export default NavBar;
