const API_BASE = '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}

// Players
export async function getPlayers() {
  return request('/players');
}
export async function getPlayer(id) {
  return request(`/players/${id}`);
}
export async function createPlayer(body) {
  return request('/players', { method: 'POST', body });
}
export async function updatePlayer(id, body) {
  return request(`/players/${id}`, { method: 'PUT', body });
}
export async function deletePlayer(id) {
  return request(`/players/${id}`, { method: 'DELETE' });
}

// Games
export async function getGames() {
  return request('/games');
}
export async function getGame(id) {
  return request(`/games/${id}`);
}
export async function createGame(body) {
  return request('/games', { method: 'POST', body });
}
export async function updateGame(id, body) {
  return request(`/games/${id}`, { method: 'PUT', body });
}
export async function deleteGame(id) {
  return request(`/games/${id}`, { method: 'DELETE' });
}

// Matches
export async function getMatches(filters = {}) {
  const params = new URLSearchParams();
  if (filters.gameId) params.set('gameId', filters.gameId);
  if (filters.date) params.set('date', filters.date);
  const qs = params.toString();
  return request(qs ? `/matches?${qs}` : '/matches');
}
export async function getMatch(id) {
  return request(`/matches/${id}`);
}
export async function createMatch(body) {
  return request('/matches', { method: 'POST', body });
}
export async function updateMatch(id, body) {
  return request(`/matches/${id}`, { method: 'PUT', body });
}
export async function deleteMatch(id) {
  return request(`/matches/${id}`, { method: 'DELETE' });
}

// Stats (computed from matches)
export async function getHeadToHeadStats(player1Id, player2Id) {
  const params = new URLSearchParams({ player1: player1Id, player2: player2Id });
  return request(`/stats/head-to-head?${params}`);
}
