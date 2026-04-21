import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { useAuth } from '../../context/AuthContext';

function NavBar() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  return (
    <nav className="navbar" aria-label="Main navigation">
      <NavLink to="/" className="navbar__link" end>
        Home
      </NavLink>
      <NavLink to="/players" className="navbar__link" end>
        Players
      </NavLink>
      <NavLink to="/games" className="navbar__link">
        Games
      </NavLink>
      <NavLink to="/matches" className="navbar__link">
        Matches
      </NavLink>
      <NavLink to="/head-to-head" className="navbar__link" title="Compare two players">
        Head-to-Head
      </NavLink>
      {auth && auth.player && auth.player._id ? (
        <NavLink
          to={`/players/${auth.player._id}`}
          className={({ isActive }) =>
            `navbar__link navbar__link--profile${isActive ? ' navbar__link--profile-active' : ''}`
          }
        >
          My Profile
        </NavLink>
      ) : null}
      {auth ? (
        <button
          type="button"
          className="navbar__link navbar__link--logout"
          onClick={async () => {
            await logout();
            navigate('/');
          }}
        >
          Logout
        </button>
      ) : (
        <>
          <NavLink to="/login" className="navbar__link">
            Login
          </NavLink>
          <NavLink to="/register" className="navbar__link navbar__link--register">
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
}

NavBar.propTypes = {};

export default NavBar;
