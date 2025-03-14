import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home';
import PlayersPage from './pages/PlayersPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import GamesPage from './pages/GamesPage';
import MatchesPage from './pages/MatchesPage';
import MatchDetailsPage from './pages/MatchDetailsPage';
import HeadToHeadPage from './pages/HeadToHeadPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/players/:id" element={<PlayerProfilePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<MatchDetailsPage />} />
          <Route path="/head-to-head" element={<HeadToHeadPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

App.propTypes = {};

export default App;
