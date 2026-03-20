# EsportsEdge

A match tracking and statistics platform for casual and competitive esports players.

**Authors:**
Raagini Tyagi, Rahul Nayak  
**Course:** CS5610 – Web Development  
**Semester:** Spring 2026  
**Instructor:** John Guerra  
**Course Website:** [Web Development (Spring 2026)](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)

**Live Demo Website:** [EsportsEdge – Live Deployment]()

**Demo Video:** [EsportsEdge – Project Demonstration Video]()

**Design Document:** [EsportsEdge – Design Document](./EsportsEdge_Design_Document.pdf)

**Project Presentation:** [EsportsEdge – Google Slides]()



## Project Objective

EsportsEdge lets users manage game titles, create and manage player profiles, log custom matches, browse match history (with filters by game and date), and view statistics such as wins, losses, win rate, and head-to-head comparisons (all computed from the matches collection).

## Features

- **Players**: Create, read, update, delete player profiles. View per-player stats (total matches, wins, losses, win rate) on the player profile page.
- **Games**: Create, read, update, delete games. Games list and game data include total match count per game.
- **Matches**: Create, read, update, delete matches. Filter by game title or date. Link matches to a game and multiple players, optional winner and score.
- **Head-to-head**: Select two players and see total shared matches and wins for each player.

## Screenshots

| Home | Players Directory |
|------|-------------------|
| ![Home](public/assets/Screenshot_Home.png) | ![Players Directory](public/assets/Screenshot_Players_directory.png) |

| Player Profile | Edit Player |
|----------------|-------------------|
| ![Player Profile](public/assets/Screenshot_Player_profile.png) | ![Edit Player](public/assets/Screenshot_Edit_player.png) |

| Games | Add Game |
|-------|-----------------|
| ![Games](public/assets/Screenshot_Games.png) | ![Add Game](public/assets/Screenshot_Add_Game.png) |

| Matches | Add Match |
|-------------------|------------------|
| ![Matches with filters](public/assets/Screenshot_Matches.png) | ![Add Match](public/assets/Screenshot_Add_Match.png) |

| Match Details | Head-to-Head |
|---------------|---------------|
| ![Match Details](public/assets/Screenshot_Match_Details.png) | ![Head-to-Head](public/assets/Screenshot_Head_To_head.png) |

| Login | Register |
|-------|----------|
| ![Login](public/assets/Screenshot_Login.png) | ![Register](public/assets/Screenshot_Register.png) |

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (native driver, no Mongoose)
- **Frontend**: React 18 + Vite, React Router
- **Styling**: CSS organized by component

## Instructions to Build

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas connection string)
- npm

### Installation

1. **Clone or download the repository**

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/esportsedge
   ```
   
   For MongoDB Atlas, use your connection string and append the database name, e.g.:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/esportsedge
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running locally, or use a MongoDB Atlas connection string in `MONGODB_URI`.

5. **Seed the database (optional)**
   
   To populate the database with sample data (100 players, 20 games, 1001 matches):
   ```bash
   cd backend
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

7. **Install frontend dependencies and start the app**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

8. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   The frontend proxies `/api` to the backend at `http://localhost:3001`.

### Development

For development with auto-reload, run the backend with `npm start` in `backend` and the frontend with `npm run dev` in `frontend`.

## API Endpoints

### Players

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get a single player (includes stats: totalMatches, wins, losses, winRate)
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player

### Games

- `GET /api/games` - Get all games (each includes matchCount)
- `GET /api/games/:id` - Get a single game (includes matchCount)
- `POST /api/games` - Create a new game
- `PUT /api/games/:id` - Update a game
- `DELETE /api/games/:id` - Delete a game (cascades to delete all matches for that game)

### Matches

- `GET /api/matches` - Get all matches (optional query params: gameId, date in YYYY-MM-DD)
- `GET /api/matches/:id` - Get a single match
- `POST /api/matches` - Create a new match
- `PUT /api/matches/:id` - Update a match
- `DELETE /api/matches/:id` - Delete a match

### Stats

- `GET /api/stats/head-to-head` - Get head-to-head stats (query params: player1, player2; returns totalShared, player1Wins, player2Wins, draws)

## Security Notes

- Database credentials are stored in environment variables (`.env` file)
- The `.env` file is excluded from version control via `.gitignore`

## Use of Generative AI

This project used ChatGPT (OpenAI) as a support tool during development.

- Assisted with frontend UI/layout and CSS styling improvements in React pages.
- Assisted with client-side JavaScript/React logic (form handling, state updates, and API integration).
- Helped troubleshoot login/authentication issues on the deployed Render application.
- Supported debugging of backend/API and environment configuration issues.

All suggestions were reviewed, adapted, and validated by the team before inclusion.

## License

MIT License - see LICENSE file for details.
