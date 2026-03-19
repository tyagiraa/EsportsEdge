require('dotenv').config();
const { connectToMongo, getDb, closeMongo } = require('../db/mongo');
const bcrypt = require('bcryptjs');

const DEFAULT_PASSWORD = 'password123';
const PLAYER_COUNT = 1400;
const MATCH_COUNT = 1400;

const FIRST_NAMES = [
'Blake', 'Drew', 'Jamie', 'Peyton', 'Kendall',
  'Finley', 'Hayden', 'Emery', 'Reagan', 'Fallon',
  'Hunter', 'River', 'Sage', 'Indigo', 'Lennon',
  'Phoenix', 'Remy', 'Aubrey', 'Jesse', 'Dakota',
  'Harley', 'Elliot', 'Mackenzie', 'Shiloh', 'Wren',
  'Adrian', 'Asher', 'Caleb', 'Dominic', 'Eli',
  'Felix', 'Gabe', 'Hudson', 'Ivan', 'Jace',
  'Kaden', 'Lance', 'Marcus', 'Nathan', 'Oscar',
  'Preston', 'Quentin', 'Reid', 'Sebastian', 'Tristan',
  'Ulric', 'Victor', 'Wesley', 'Xander', 'Zane',
  'Aaron', 'Beau', 'Cole', 'Dean', 'Evan',
  'Finn', 'Grant', 'Hank', 'Ian', 'Joel',
  'Kyle', 'Luke', 'Miles', 'Nate', 'Owen',
  'Pierce', 'Rex', 'Seth', 'Theo', 'Wade',
  'Abel', 'Brody', 'Cruz', 'Drake', 'Ford',
  'Gage', 'Heath', 'Isaac', 'Jett', 'Knox',
  'Luca', 'Max', 'Neil', 'Omar', 'Penn',
  'Rhett', 'Sloane', 'Tanner', 'Uri', 'Vance',
  'Wyatt', 'Yael', 'Zack', 'Alec', 'Brett',
  'Chad', 'Derek', 'Eddie', 'Frank', 'Glen',
  'Hannah', 'Iris', 'Jade', 'Kelsey', 'Luna',
  'Maya', 'Nina', 'Piper', 'Rosa', 'Sara',
  'Tara', 'Uma', 'Vera', 'Winnie', 'Xena',
  'Yara', 'Zoe', 'Abby', 'Bree', 'Claire',
  'Diana', 'Elena', 'Faith', 'Grace', 'Holly',
  'Isabel', 'Julia', 'Kate', 'Laura', 'Megan',
  'Nicole', 'Paige', 'Quinn', 'Rachel', 'Stella',
  'Tessa', 'Ursula', 'Violet', 'Wendy', 'Ximena',
  'Yasmine', 'Zara', 'Alice', 'Bella', 'Chloe',
  'Daisy', 'Eva', 'Fiona', 'Gwen', 'Hazel',
  'Ivy', 'Jenna', 'Kira', 'Lily', 'Mae',
  'Naomi', 'Opal', 'Penny', 'Ruby', 'Sydney',
  'Tatum', 'Unity', 'Vivi', 'Willow', 'Xia',
  'Yuki', 'Zelda', 'Ariel', 'Bianca', 'Carmen',
  'Demi', 'Elise', 'Freya', 'Gloria', 'Helen',
  'Ingrid', 'Josie', 'Kristen', 'Leah', 'Miriam',
  'Nova', 'Odessa', 'Portia', 'Renee', 'Selene',
  'Thea', 'Uriah', 'Vivian', 'Willa', 'Xander',
  'Yasmin', 'Zion', 'Andre', 'Bruno', 'Carlos',
  'Diego', 'Emilio', 'Felipe', 'Gustavo', 'Hector',
  'Ignacio', 'Jorge', 'Kevin', 'Luis', 'Manuel',
  'Nicolas', 'Pablo', 'Rafael', 'Santiago', 'Tomas',
  'Umberto', 'Vitor', 'Wilfredo', 'Xavier', 'Yusuf',
  'Zaid', 'Aarav', 'Bodhi', 'Cyrus', 'Darius',
  'Ezra', 'Fabian', 'Griffin', 'Hamid', 'Idris',
  'Jaxon', 'Kieran', 'Leander', 'Micah', 'Nico',
  'Orion', 'Pascal', 'Rashid', 'Soren', 'Tobias',
  'Udo', 'Vasil', 'Willem', 'Xavi', 'Yannick',
  'Zephyr', 'Alvin', 'Brendan', 'Conrad', 'Dion',
  'Edwin', 'Flynn', 'Gavin', 'Hugo', 'Igor',
  'Jerome', 'Karl', 'Leon', 'Morris', 'Nigel',
  'Oliver', 'Philip', 'Ronin', 'Stefan', 'Tariq',
  'Umar', 'Vlad', 'Warren', 'Yahya', 'Zoltan',
  'Amos', 'Blaine', 'Cade', 'Dell', 'Emmet',
  'Fritz', 'Gideon', 'Hal', 'Ira', 'Jules',
  'Kiefer', 'Lars', 'Marco', 'Nico', 'Orson',
  'Pax', 'Quincy', 'Roan', 'Silas', 'Tad',
  'Upton', 'Vaughn', 'Weston', 'Yosef', 'Zane',
  'Alicia', 'Brynn', 'Cora', 'Delilah', 'Esme',
];

const LAST_NAMES = [
'Johnson', 'Williams', 'Jones', 'Davis', 'Miller',
  'Moore', 'Taylor', 'Jackson', 'Thompson', 'Lee',
  'Robinson', 'Harris', 'Evans', 'Turner', 'Collins',
  'Edwards', 'Stewart', 'Morris', 'Reed', 'Rivera',
  'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward',
  'Torres', 'Peterson', 'Gray', 'Ramirez', 'James',
  'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price',
  'Bennett', 'Wood', 'Barnes', 'Ross', 'Henderson',
  'Coleman', 'Jenkins', 'Perry', 'Powell', 'Long',
  'Patterson', 'Hughes', 'Flores', 'Washington', 'Butler',
  'Simmons', 'Foster', 'Gonzales', 'Bryant', 'Alexander',
  'Russell', 'Griffin', 'Diaz', 'Hayes', 'Myers',
  'Ford', 'Hamilton', 'Graham', 'Sullivan', 'Wallace',
  'Woods', 'Cole', 'West', 'Jordan', 'Owens',
  'Reynolds', 'Fisher', 'Ellis', 'Harrison', 'Gibson',
  'McDonald', 'Cruz', 'Marshall', 'Ortiz', 'Gomez',
  'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson',
  'Stevens', 'Tucker', 'Porter', 'Hunter', 'Hicks',
  'Crawford', 'Henry', 'Boyd', 'Mason', 'Morales',
  'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes',
  'Burns', 'Gordon', 'Shaw', 'Holmes', 'Rice',
  'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer',
  'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson',
  'Rose', 'Stone', 'Hawkins', 'Dunn', 'Perkins',
  'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne',
  'Pierce', 'Berry', 'Matthews', 'Arnold', 'Wagner',
  'Willis', 'Ray', 'Watkins', 'Olson', 'Carroll',
  'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley',
  'Lane', 'Andrews', 'Ruiz', 'Harper', 'Fox',
  'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene',
  'Lawrence', 'Elliott', 'Chavez', 'Sims', 'Austin',
  'Peters', 'Kelley', 'Franklin', 'Lawson', 'Fields',
  'Gutierrez', 'Ryan', 'Schmidt', 'Carr', 'Vasquez',
  'Castillo', 'Wheeler', 'Chapman', 'Montgomery', 'Richards',
  'Williamson', 'Johnston', 'Banks', 'Meyer', 'Bishop',
  'McCoy', 'Howell', 'Alvarez', 'Morrison', 'Hansen',
  'Fernandez', 'Garza', 'Harvey', 'Little', 'Burton',
  'Stanley', 'Nguyen', 'George', 'Jacobs', 'Reid',
  'Kim', 'Fuller', 'Lynch', 'Dean', 'Gilbert',
  'Garrett', 'Romero', 'Welch', 'Larson', 'Frazier',
  'Burke', 'Hanson', 'Day', 'Mendoza', 'Moreno',
  'Bowman', 'Medina', 'Fowler', 'Brewer', 'Hoffman',
  'Carlson', 'Silva', 'Pearson', 'Holland', 'Douglas',
  'Fleming', 'Jensen', 'Vargas', 'Byrd', 'Davidson',
  'Hopkins', 'May', 'Terry', 'Herrera', 'Wade',
  'Soto', 'Walters', 'Curtis', 'Neal', 'Caldwell',
  'Lowe', 'Jennings', 'Barnett', 'Graves', 'Jimenez',
  'Horton', 'Shelton', 'Barrett', 'Obrien', 'Castro',
  'Sutton', 'Gregory', 'McKinney', 'Lucas', 'Miles',
  'Craig', 'Rodriquez', 'Chambers', 'Holt', 'Lambert',
  'Fletcher', 'Watts', 'Bates', 'Hale', 'Rhodes',
  'Pham', 'Le', 'Tran', 'Vo', 'Dinh',
  'Park', 'Yoon', 'Cho', 'Lim', 'Jeon',
  'Nakamura', 'Tanaka', 'Suzuki', 'Yamamoto', 'Watanabe',
  'Kobayashi', 'Ito', 'Kato', 'Yoshida', 'Yamada',
  'Ivanov', 'Petrov', 'Sokolov', 'Novak', 'Kowalski',
  'Wojcik', 'Kowalczyk', 'Wisniewska', 'Kaminski', 'Lewandowski',
  'Mueller', 'Schneider', 'Fischer', 'Weber', 'Meyer',
  'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch',
  'Hassan', 'Ali', 'Khan', 'Ahmed', 'Rahman',
];

const GAME_NAMES = [
// FPS / Tactical Shooters
'Halo Infinite', 'Battlefield 2042', 'Titanfall 2', 'Quake Champions',
'Splitgate', 'Hyper Scape', 'Warface', 'Crossfire', 'Point Blank',
'Paladins', 'Rogue Company', 'Enlisted', 'Hell Let Loose', 'Post Scriptum',
'Squad', 'Arma 3', 'Insurgency Sandstorm', 'Escape from Tarkov',
'Hunt Showdown', 'Hunting Simulator', 'Sniper Elite 5', 'Ready or Not',
'Zero Hour', 'Ground Branch', 'Bright Memory Infinite', 'SUPERHOT',
'Ultrakill', 'Prodeus', 'Amid Evil', 'Ion Fury', 'DUSK',
'Turbo Overkill', 'Cultic', 'Blood Fresh Supply', 'Rollerdrome',

// Battle Royale
'PUBG Battlegrounds', 'Warzone', 'Super People', 'Naraka Bladepoint',
'Rumbleverse', 'Spellbreak', 'Darwin Project', 'Realm Royale',
'Cuisine Royale', 'Farlight 84', 'Battlerite Royale', 'Islands of Nyne',
'Escape from Tarkov Arena', 'The Cycle Frontier', 'Scavengers',

// MOBAs
'Smite', 'Heroes of the Storm', 'Paragon The Overprime', 'Predecessor',
'Mobile Legends', 'Arena of Valor', 'Honor of Kings', 'Wild Rift',
'Pokémon Unite', 'Battlerite', 'Fault', 'Strife', 'Gigantic',
'Awesomenauts', 'Vainglory', 'Atlas Reactor',

// RTS / Strategy
'Age of Empires IV', 'Age of Empires II DE', 'Command and Conquer Remastered',
'Warcraft III Reforged', 'Brood War', 'StarCraft Remastered',
'Total War Warhammer III', 'Company of Heroes 3', 'Men of War',
'Steel Division 2', 'Gates of Hell Ostfront', 'Halo Wars 2',
'Northgard', 'They Are Billions', 'Frostpunk', 'Offworld Trading Company',
'Homeworld 3', 'Endless Legend', 'Humankind', 'Civilization VI',
'Civilization VII', 'Old World', 'Victoria 3', 'Hearts of Iron IV',
'Europa Universalis IV', 'Crusader Kings III', 'Stellaris', 'Imperator Rome',
'Tropico 6', 'Anno 1800', 'Cities Skylines II', 'Planet Zoo',
'Two Point Campus', 'Fabledom', 'Foundation', 'Timberborn',

// Card Games / Autobattlers
'Legends of Runeterra', 'Mythgard', 'Shadowverse', 'Eternal Card Game',
'Marvel Snap', 'Gwent', 'Artifact', 'Teppen', 'Faeria',
'Slay the Spire', 'Monster Train', 'Roguebook', 'Cobalt Core',
'Balatro', 'Inscryption', 'Ring of Pain',
'Teamfight Tactics', 'Underlords', 'Dota Underlords', 'Hearthstone Battlegrounds',
'Storybook Brawl', 'Super Auto Pets', 'Minion Masters',

// Fighting Games
'Guilty Gear Strive', 'Dragon Ball FighterZ', 'Mortal Kombat 1',
'Injustice 2', 'Soulcalibur VI', 'Granblue Fantasy Versus Rising',
'Under Night In-Birth II', 'BlazBlue Central Fiction', 'Melty Blood',
'King of Fighters XV', 'Samurai Shodown', 'Fatal Fury City of the Wolves',
'DNF Duel', 'Skullgirls', 'Them Fightin Herds', 'Fantasy Strike',
'Pocket Bravery', 'Fraymakers', 'Rivals of Aether 2', 'MultiVersus',
'Nickelodeon All Star Brawl 2', 'Rushdown Revolt', 'Brawlout',

// Sports / Racing
'eFootball', 'NHL 24', 'NBA 2K24', 'NBA 2K25', 'Madden NFL 24',
'F1 24', 'F1 23', 'iRacing', 'Gran Turismo 7', 'Forza Motorsport',
'Forza Horizon 5', 'Need for Speed Unbound', 'The Crew Motorfest',
'Project Cars 3', 'Assetto Corsa Competizione', 'rFactor 2',
'Wreckfest', 'FlatOut 4', 'Dirt Rally 2', 'WRC Generations',
'Riders Republic', 'Steep', 'TopSpin 2K25', 'Ping Pong Fury',
'Handball 23', 'Rugby 24', 'Cricket 24', 'PGA Tour 2K23',
'Golf Clash', 'Disc Golf Valley', 'Ultimate Disc League',

// Platformers / Action
'Hollow Knight Silksong', 'Celeste', 'Dead Cells', 'Hades II',
'Curse of the Dead Gods', 'Rogue Legacy 2', 'Returnal', 'Neon Abyss',
'Enter the Gungeon', 'Nuclear Throne', 'Risk of Rain 2', 'Risk of Rain Returns',
'Noita', 'Spelunky 2', 'Binding of Isaac Repentance', 'Vampire Survivors',
'Brotato', 'Halls of Torment', '20 Minutes Till Dawn', 'Soul Knight',
'Cuphead', 'Ori and the Will of the Wisps', 'Hollow Knight',
'Shovel Knight', 'Axiom Verge 2', 'Metroid Dread', 'Blasphemous 2',
'Salt and Sacrifice', 'Nine Sols', 'Prince of Persia Lost Crown',
'Astro Bot', 'Super Mario Wonder', 'Kirby Forgotten Land',

// RPG / Action RPG
'Elden Ring', 'Dark Souls III', 'Sekiro Shadows Die Twice',
'Lies of P', 'Wo Long Fallen Dynasty', 'Lords of the Fallen',
'The First Descendant', 'Outriders', 'Remnant II', 'Dauntless',
'Monster Hunter World', 'Monster Hunter Rise', 'Monster Hunter Wilds',
'God of War Ragnarok', 'Immortals Fenyx Rising', 'Assassins Creed Mirage',
'Hogwarts Legacy', 'Starfield', 'Cyberpunk 2077', 'The Witcher 3',
'Baldurs Gate 3', 'Divinity Original Sin 2', 'Pathfinder Wrath',
'Solasta Crown of the Magister', 'Pillars of Eternity II',
'Tyranny', 'Disco Elysium', 'Shadowrun Returns', 'Colony Ship',
'Wildermyth', 'Battle Brothers', 'Wartales', 'Expeditions Rome',

// MMO / Online RPG
'World of Warcraft Classic', 'Final Fantasy XIV', 'Guild Wars 2',
'Elder Scrolls Online', 'Black Desert Online', 'Lost Ark',
'New World', 'Albion Online', 'Runescape', 'Old School Runescape',
'Tibia', 'Lineage II', 'Aion Classic', 'Blade and Soul',
'TERA', 'ArcheAge', 'Neverwinter', 'Path of Exile 2',
'Diablo IV', 'Torchlight Infinite', 'Last Epoch', 'Grim Dawn',

// Sandbox / Survival / Crafting
'Valheim', 'Rust', 'ARK Survival Ascended', 'Green Hell',
'The Forest', 'Sons of the Forest', 'Subnautica Below Zero',
'Raft', 'Stranded Deep', 'The Long Dark', 'Icarus',
'Grounded', 'Core Keeper', 'Terraria', 'Starbound',
'Stardew Valley', 'Coral Island', 'Lightyear Frontier',
'Farming Simulator 25', 'Ranch Simulator', 'My Time at Sandrock',
'Palworld', 'Temtem', 'Cassette Beasts',

// Puzzle / Indie
'Portal 2', 'The Witness', 'Outer Wilds', 'Return of the Obra Dinn',
'Baba Is You', 'The Talos Principle II', 'Stephen Sausage Roll',
'Manifold Garden', 'Antichamber', 'Myst', 'Obduction',
'Viewfinder', 'Chants of Sennaar', 'Animal Well', 'UFO 50',
'Cocoon', 'Lorelei and the Laser Eyes', 'Botany Manor',

// Horror / Asymmetric
'Dead by Daylight', 'Friday the 13th The Game', 'Evil Dead The Game',
'The Texas Chain Saw Massacre', 'Meet Your Maker', 'Propnight',
'Demonologist', 'Phasmophobia', 'Devour', 'Labyrinthine',
'Forewarned', 'The Blackout Club', 'Identity V', 'Deceit 2',

// Party / Social
'Jackbox Party Pack 10', 'Pummel Party', 'PlateUp', 'Overcooked All You Can Eat',
'Moving Out 2', 'Tools Up', 'Gang Beasts', 'Human Fall Flat',
'Totally Accurate Battle Simulator', 'Wobbly Life', 'Stick Fight',
'Lethal Company', 'Content Warning', 'No More Room in Hell 2',

// Rhythm / Music
'Beat Saber', 'Synth Riders', 'Pistol Whip', 'Audio Trip',
'Thumper', 'Muse Dash', 'Cytus II', 'Osu', 'Clone Hero',
'Guitar Hero Live', 'Rock Band 4', 'Taiko no Tatsujin',
'Friday Night Funkin', 'Spin Rhythm XD', 'Soundfall',

// Esports Titles (newer/niche)
'Battlerite', 'Bleeding Edge', 'Crucible', 'Hyper Scape',
'Quake Live', 'Enemy Territory Quake Wars', 'Tribes Ascend',
'Midair 2', 'Diabotical', 'Toxikk', 'Shootmania Storm',
'Reflex Arena', 'Warsow', 'Xonotic', 'AssaultCube',
];
const GENRES = [ 'FPS', 'MOBA', 'Battle Royale', 'Fighting', 'Sports', 'Strategy',
  'Card', 'RTS', 'RPG', 'Action RPG', 'MMO', 'Survival', 'Sandbox',
  'Platformer', 'Puzzle', 'Horror', 'Rhythm', 'Racing', 'Party', 'Autobattler',];
const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Cross-platform', 'Nintendo Switch', 'Mobile',];
const DEVELOPERS = ['Riot', 'Valve', 'Blizzard', 'Epic', 'EA', 'Nintendo', 'Ubisoft',
  'Activision', 'Bandai Namco', 'Capcom', 'CD Projekt Red', 'FromSoftware',
  'Bungie', '343 Industries', 'Respawn', 'Treyarch', 'Infinity Ward',
  'NetEase', 'miHoYo', 'Tencent', 'Nexon', 'NCSoft', 'Krafton',
  'Coffee Stain', 'Team17', 'Devolver Digital', 'Annapurna Interactive',];
const UNIQUE_GAME_NAMES = Array.from(new Set(GAME_NAMES));

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateWithinDays(daysAgo) {
  const now = Date.now();
  const past = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

function createRandomPlayerIdentity(index) {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const displayName = `${first} ${last}`;
  const username = `${first}.${last}.${index + 1}`.toLowerCase();
  return { username, displayName };
}

async function seed() {
  await connectToMongo();
  const db = getDb();
  const playersCol = db.collection('players');
  const usersCol = db.collection('users');
  const gamesCol = db.collection('games');
  const matchesCol = db.collection('matches');

  await playersCol.deleteMany({});
  await usersCol.deleteMany({});
  await gamesCol.deleteMany({});
  await matchesCol.deleteMany({});

  const playerIds = [];
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  for (let i = 0; i < PLAYER_COUNT; i++) {
    const identity = createRandomPlayerIdentity(i);
    const u = identity.username;
    const userResult = await usersCol.insertOne({
      username: u,
      passwordHash,
      createdAt: new Date(),
    });
    const userId = userResult.insertedId;
    const doc = {
      username: u,
      displayName: identity.displayName,
      email: `${u}@example.com`,
      favoriteGame: pick(GAME_NAMES),
      bio: i % 3 === 0 ? `Bio for ${u}` : null,
      userId,
      createdAt: new Date(),
    };
    const result = await playersCol.insertOne(doc);
    playerIds.push(result.insertedId);
  }
  console.log(`Inserted ${playerIds.length} players.`);

  const gameIds = [];
  for (const name of UNIQUE_GAME_NAMES) {
    const doc = {
      name,
      genre: pick(GENRES),
      platform: pick(PLATFORMS),
      developer: pick(DEVELOPERS),
      createdAt: new Date(),
    };
    const result = await gamesCol.insertOne(doc);
    gameIds.push(result.insertedId);
  }
  console.log(`Inserted ${gameIds.length} games.`);

  for (let i = 0; i < MATCH_COUNT; i++) {
    const numPlayers = 2;
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);
    const players = shuffled.slice(0, numPlayers).map((id) => id);
    const winnerId = Math.random() > 0.1 ? pick(players) : null;
    const doc = {
      gameId: pick(gameIds),
      date: randomDateWithinDays(365),
      players,
      winnerId,
      score: winnerId && Math.random() > 0.5 ? '2-1' : null,
      notes: Math.random() > 0.8 ? 'Seed match' : null,
      createdAt: new Date(),
    };
    await matchesCol.insertOne(doc);
  }
  console.log(`Inserted ${MATCH_COUNT} matches.`);

  await closeMongo();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
