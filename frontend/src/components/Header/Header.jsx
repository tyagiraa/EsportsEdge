import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__title">
        EsportsEdge
      </Link>
    </header>
  );
}

Header.propTypes = {};

export default Header;
