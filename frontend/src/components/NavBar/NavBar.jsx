import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { useAuth } from '../../context/AuthContext';

function NavBar() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

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
      {auth && auth.player && auth.player._id ? (
        <NavLink to={`/players/${auth.player._id}`} className="navbar__link">
          My Profile
        </NavLink>
      ) : null}
      {auth ? (
        <button
          type="button"
          className="navbar__link"
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
          <NavLink to="/register" className="navbar__link">
            Register
          </NavLink>
        </>
      )}
    </nav>
  );
}

NavBar.propTypes = {};

export default NavBar;
