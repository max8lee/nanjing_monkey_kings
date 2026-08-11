/* ==========================================================================
   NANJING MONKEY KINGS - ESPN SPORTS HUB APPLICATION ENGINE (app.js)
   ========================================================================== */

// ==========================================================================
// SEASON 2 DATA STORES (POPULATED DIRECTLY FROM OFFICIAL VOLO STAT TRACKER)
// ==========================================================================
const DATA_ROSTER_SEASON2 = [
    { id: 'p3', name: 'Arjun Virmani', nickname: '', jersey: '#10', pos: 'Guard', ppg: 13.3, rpg: 3.3, apg: 1.0, fgPct: '26.9%', p3Pct: '25.0%', ftPct: '100%', height: '6\'3"', weight: '185 lbs', college: 'Stanford', status: 'Active / Top Scorer', img: 'assets/lin_wei.jpg', bio: 'Team leading scorer averaging 13.3 PPG. Exploded for 18 points (4 3PM) in the Game 3 victory over Team Blue and leads Nanjing with 7 total 3-pointers.' },
    { id: 'p2', name: 'Kevin Chen', nickname: 'MONKEV', jersey: '#2', pos: 'Guard', ppg: 11.0, rpg: 5.5, apg: 1.5, fgPct: '28.6%', p3Pct: '20.0%', ftPct: '23.8%', height: '6\'2"', weight: '185 lbs', college: 'UCLA', status: 'Active / Starter', img: 'assets/blakeney.jpg', bio: 'Dynamic attacking guard averaging 11.0 PPG and 5.5 RPG. Dropped a team-high 15 points and 6 rebounds in the Game 1 opener against Team White.' },
    { id: 'p1', name: 'Brendan Wong', nickname: 'BBOY', jersey: '#3', pos: 'Guard', ppg: 11.0, rpg: 4.0, apg: 3.0, fgPct: '29.4%', p3Pct: '0.0%', ftPct: '20.0%', height: '6\'1"', weight: '180 lbs', college: 'UC Berkeley', status: 'Active / Starter', img: 'assets/lin_wei.jpg', bio: 'Lead floor general averaging 11.0 PPG and a team-high 3.0 APG. Scored 11 points and dished 3 assists in his season debut victory over Team Blue.' },
    { id: 'p9', name: 'Yash Sharma', nickname: 'Smoove', jersey: '#0', pos: 'Forward', ppg: 6.0, rpg: 1.0, apg: 0.0, fgPct: '60.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'6"', weight: '205 lbs', college: 'San Jose State', status: 'Active / Rotation', img: 'assets/hero.jpg', bio: 'Ultra-efficient wing scorer shooting 60% FG. Debuted with 6 points (3/5 FGM), 1 block, and 1 steal in the 41-38 victory over Team Blue.' },
    { id: 'p4', name: 'Sidharth Dudyala', nickname: 'APE', jersey: '#35', pos: 'Center', ppg: 3.5, rpg: 8.0, apg: 0.0, fgPct: '37.5%', p3Pct: '0.0%', ftPct: '50.0%', height: '6\'9"', weight: '235 lbs', college: 'USC', status: 'Active / Defensive Anchor', img: 'assets/logo.webp', bio: 'Interior rim protector averaging 8.0 RPG and 3.0 BLK. Anchored the defense with 4 blocks, 3 steals, and 7 rebounds in Game 3 vs Team Blue.' },
    { id: 'p10', name: 'Vaishik Kota', nickname: 'Vee', jersey: '#14', pos: 'Center', ppg: 3.0, rpg: 12.0, apg: 1.0, fgPct: '20.0%', p3Pct: '0.0%', ftPct: '33.3%', height: '6\'8"', weight: '230 lbs', college: 'Santa Clara', status: 'Active / Glass Cleaner', img: 'assets/logo.webp', bio: 'Dominant rebounder pulling down a team-record 12 rebounds (9 DREB, 3 OREB) in his Season 2 debut vs Team Blue.' },
    { id: 'p8', name: 'Xuanyi Wang', nickname: 'LeApe', jersey: '#23', pos: 'Guard', ppg: 2.5, rpg: 2.5, apg: 0.0, fgPct: '40.0%', p3Pct: '33.3%', ftPct: '0.0%', height: '6\'1"', weight: '175 lbs', college: 'NYU', status: 'Active / Rotation', img: 'assets/blakeney.jpg', bio: 'Quick 3-and-D guard who knocked down a clutch 3-pointer and grabbed 5 rebounds against Team White.' },
    { id: 'p6', name: 'Kenneth Liou', nickname: '习近平', jersey: '#4', pos: 'Forward/Center', ppg: 2.0, rpg: 7.0, apg: 1.0, fgPct: '16.7%', p3Pct: '0.0%', ftPct: '66.7%', height: '6\'7"', weight: '215 lbs', college: 'UC Davis', status: 'Active / Rotation', img: 'assets/hero.jpg', bio: 'High-volume rebounding forward averaging 7.0 RPG (2.8 OREB). Scored 4 points and grabbed 8 boards vs Team Green.' },
    { id: 'p5', name: 'Ethan Hu', nickname: 'HUNOBO', jersey: '#1', pos: 'Forward', ppg: 1.3, rpg: 3.7, apg: 0.3, fgPct: '6.7%', p3Pct: '9.1%', ftPct: '50.0%', height: '6\'5"', weight: '200 lbs', college: 'UC San Diego', status: 'Active / Rotation', img: 'assets/hero.jpg', bio: 'Versatile forward providing wing defense, board crash hustle (3.7 RPG), and transition energy across all 3 games.' },
    { id: 'p12', name: 'Thomas Ngo', nickname: 'TOMKONG', jersey: '#7', pos: 'Guard', ppg: 1.0, rpg: 1.0, apg: 0.3, fgPct: '10.0%', p3Pct: '16.7%', ftPct: '0.0%', height: '5\'11"', weight: '165 lbs', college: 'San Francisco', status: 'Active / Rotation', img: 'assets/blakeney.jpg', bio: 'Fast floor general who drained a long-range 3-pointer vs Team Green and provides backcourt handles.' },
    { id: 'p7', name: 'Max Lee', nickname: 'MUDBONE', jersey: '#8', pos: 'Forward', ppg: 0.0, rpg: 4.0, apg: 0.5, fgPct: '0.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'4"', weight: '195 lbs', college: 'Nanjing Tech', status: 'Active / Captain', img: 'assets/hero.jpg', bio: 'Tenacious team captain and perimeter defender pulling down 4.0 RPG with aggressive ball movement.' },
    { id: 'p11', name: 'Markus Wong', nickname: 'TITANIC', jersey: '#34', pos: 'Guard', ppg: 0.0, rpg: 0.0, apg: 0.0, fgPct: '0.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'0"', weight: '170 lbs', college: 'UC Irvine', status: 'Active / Reserve', img: 'assets/lin_wei.jpg', bio: 'High energy perimeter guard providing backcourt defense and team communication.' },
    { id: 'p13', name: 'Will Park', nickname: '', jersey: '#12', pos: 'Guard', ppg: 0.0, rpg: 3.0, apg: 0.0, fgPct: '0.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'1"', weight: '175 lbs', college: 'Washington', status: 'Active / Reserve', img: 'assets/lin_wei.jpg', bio: 'Relentless perimeter defender securing 3.0 RPG across back-to-back appearances.' },
    { id: 'p14', name: 'Steven Ngo', nickname: '', jersey: '#13', pos: 'Guard', ppg: 0.0, rpg: 1.0, apg: 0.0, fgPct: '0.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'0"', weight: '170 lbs', college: 'Oregon', status: 'Active / Reserve', img: 'assets/blakeney.jpg', bio: 'Active perimeter guard with high motor on transition defense and wing positioning.' }
];

const DATA_SCHEDULE_SEASON2 = [
    { date: 'AUG 15 • 19:35', opp: 'Gold Lions', venue: 'Telegraph Hill Community Center', status: 'UPCOMING', perf: 'Next Game', isHome: true },
    { date: 'AUG 19 • 19:35', opp: 'Red Rockets', venue: 'Away Court', status: 'UPCOMING', perf: 'TBD', isHome: false },
    { date: 'AUG 23 • 19:35', opp: 'Black Mambas', venue: 'Telegraph Hill Community Center', status: 'UPCOMING', perf: 'TBD', isHome: true },
    { date: 'AUG 03 • 19:35', opp: 'Blue', venue: 'Telegraph Hill Community Center', status: 'W 41-38', perf: 'Arjun Virmani (18 pts, 4 3PM)', isHome: true },
    { date: 'JUL 27 • 19:35', opp: 'Green', venue: 'Telegraph Hill Community Center', status: 'L 33-38', perf: 'Arjun Virmani (11 pts, 3 3PM)', isHome: false },
    { date: 'JUL 20 • 19:35', opp: 'White', venue: 'Telegraph Hill Community Center', status: 'L 31-67', perf: 'Kevin Chen (15 pts, 6 reb)', isHome: true }
];

const DATA_STATS_SEASON2 = [
    { id: 'p3', name: 'Arjun Virmani', pos: 'SG', gp: 3, mpg: '28.0', ppg: 13.3, rpg: 3.3, apg: 1.0, spg: 1.3, bpg: 0.3, fg: '26.9%', p3: '25.0%' },
    { id: 'p1', name: 'Brendan Wong', pos: 'PG', gp: 1, mpg: '30.0', ppg: 11.0, rpg: 4.0, apg: 3.0, spg: 1.0, bpg: 0.0, fg: '29.4%', p3: '0.0%' },
    { id: 'p2', name: 'Kevin Chen', pos: 'SG', gp: 2, mpg: '32.0', ppg: 11.0, rpg: 5.5, apg: 1.5, spg: 1.5, bpg: 0.0, fg: '28.6%', p3: '20.0%' },
    { id: 'p9', name: 'Yash Sharma', pos: 'SF', gp: 1, mpg: '20.0', ppg: 6.0, rpg: 1.0, apg: 0.0, spg: 1.0, bpg: 1.0, fg: '60.0%', p3: '0.0%' },
    { id: 'p4', name: 'Sidharth Dudyala', pos: 'C', gp: 2, mpg: '26.0', ppg: 3.5, rpg: 8.0, apg: 0.0, spg: 3.0, bpg: 3.0, fg: '37.5%', p3: '0.0%' },
    { id: 'p10', name: 'Vaishik Kota', pos: 'C', gp: 1, mpg: '24.0', ppg: 3.0, rpg: 12.0, apg: 1.0, spg: 0.0, bpg: 0.0, fg: '20.0%', p3: '0.0%' },
    { id: 'p8', name: 'Xuanyi Wang', pos: 'SG', gp: 2, mpg: '18.0', ppg: 2.5, rpg: 2.5, apg: 0.0, spg: 0.5, bpg: 0.0, fg: '40.0%', p3: '33.3%' },
    { id: 'p6', name: 'Kenneth Liou', pos: 'PF', gp: 2, mpg: '22.0', ppg: 2.0, rpg: 7.0, apg: 1.0, spg: 1.5, bpg: 0.0, fg: '16.7%', p3: '0.0%' },
    { id: 'p5', name: 'Ethan Hu', pos: 'SF', gp: 3, mpg: '24.0', ppg: 1.3, rpg: 3.7, apg: 0.3, spg: 0.0, bpg: 0.0, fg: '6.7%', p3: '9.1%' },
    { id: 'p12', name: 'Thomas Ngo', pos: 'PG', gp: 3, mpg: '18.0', ppg: 1.0, rpg: 1.0, apg: 0.3, spg: 0.0, bpg: 0.0, fg: '10.0%', p3: '16.7%' },
    { id: 'p7', name: 'Max Lee', pos: 'SF', gp: 2, mpg: '22.0', ppg: 0.0, rpg: 4.0, apg: 0.5, spg: 0.5, bpg: 0.0, fg: '0.0%', p3: '0.0%' }
];

const DATA_STANDINGS_SEASON2 = [
    { rk: 1, team: 'Blue', w: 2, l: 1, pct: '.667', gb: '-', home: '1-1', away: '1-0', strk: 'L1', l10: '2-1' },
    { rk: 2, team: 'Green', w: 2, l: 1, pct: '.667', gb: '-', home: '1-0', away: '1-1', strk: 'W1', l10: '2-1' },
    { rk: 3, team: 'White', w: 1, l: 2, pct: '.333', gb: '1.0', home: '1-1', away: '0-1', strk: 'L1', l10: '1-2' },
    { rk: 4, team: 'Nanjing Monkey Kings', w: 1, l: 2, pct: '.333', gb: '1.0', home: '1-1', away: '0-1', strk: 'W1', l10: '1-2', highlight: true }
];

// ==========================================================================
// SEASON 1 DATA STORES (HISTORICAL INAUGURAL SEASON: 5/18 - 6/29)
// ==========================================================================
const DATA_ROSTER_SEASON1 = [
    { id: 'p7', name: 'Max Lee', nickname: 'MUDBONE', jersey: '#8', pos: 'Forward', ppg: 7.5, rpg: 4.2, apg: 1.5, fgPct: '38.0%', p3Pct: '28.0%', ftPct: '60.0%', height: '6\'4"', weight: '195 lbs', college: 'Nanjing Tech', status: 'Season 1 Team Captain', img: 'assets/hero.jpg', bio: 'Inaugural Season Team Captain. Led the Monkey Kings through all 6 games at Mission Dolores Academy, capping off the season with a 40-19 blowout win vs Adam Silvers\' Hairstylist.' },
    { id: 'p1', name: 'Brendan Wong', nickname: 'BBOY', jersey: '#3', pos: 'Guard', ppg: 8.2, rpg: 3.1, apg: 2.8, fgPct: '36.5%', p3Pct: '30.0%', ftPct: '50.0%', height: '6\'1"', weight: '180 lbs', college: 'UC Berkeley', status: 'Season 1 Core Member', img: 'assets/lin_wei.jpg', bio: 'Primary Season 1 ball-handler providing backcourt pace and defensive pressure.' },
    { id: 'p2', name: 'Kevin Chen', nickname: 'MONKEV', jersey: '#2', pos: 'Guard', ppg: 9.5, rpg: 4.0, apg: 1.8, fgPct: '35.0%', p3Pct: '25.0%', ftPct: '45.0%', height: '6\'2"', weight: '185 lbs', college: 'UCLA', status: 'Season 1 Core Member', img: 'assets/blakeney.jpg', bio: 'High-volume attack guard scoring double figures in Season 1 key games.' },
    { id: 'p12', name: 'Thomas Ngo', nickname: 'TOMKONG', jersey: '#7', pos: 'Guard', ppg: 4.2, rpg: 1.5, apg: 1.2, fgPct: '28.0%', p3Pct: '22.0%', ftPct: '0.0%', height: '5\'11"', weight: '165 lbs', college: 'San Francisco', status: 'Season 1 Core Member', img: 'assets/blakeney.jpg', bio: 'Fast perimeter distributor anchoring the Season 1 backcourt rotation.' },
    { id: 'p6', name: 'Kenneth Liou', nickname: '习近平', jersey: '#4', pos: 'Forward/Center', ppg: 5.0, rpg: 6.5, apg: 0.8, fgPct: '40.0%', p3Pct: '0.0%', ftPct: '50.0%', height: '6\'7"', weight: '215 lbs', college: 'UC Davis', status: 'Season 1 Core Member', img: 'assets/hero.jpg', bio: 'Season 1 primary paint presence pulling down 6.5 RPG at Mission Dolores Court.' },
    { id: 'p5', name: 'Ethan Hu', nickname: 'HUNOBO', jersey: '#1', pos: 'Forward', ppg: 3.5, rpg: 3.8, apg: 0.5, fgPct: '22.0%', p3Pct: '15.0%', ftPct: '50.0%', height: '6\'5"', weight: '200 lbs', college: 'UC San Diego', status: 'Season 1 Full Field Member', img: 'assets/hero.jpg', bio: 'Wing defender and transition runner in the Season 1 full field lineup.' },
    { id: 'p15', name: 'Stephen Zhong', nickname: '', jersey: '#9', pos: 'Forward', ppg: 4.0, rpg: 3.0, apg: 0.5, fgPct: '33.0%', p3Pct: '20.0%', ftPct: '0.0%', height: '6\'4"', weight: '190 lbs', college: 'UC Santa Cruz', status: 'Season 1 Full Field Member', img: 'assets/hero.jpg', bio: 'Season 1 wing forward providing perimeter size and fast-break finishes.' },
    { id: 'p8', name: 'Xuanyi Wang', nickname: 'LeApe', jersey: '#23', pos: 'Guard', ppg: 3.8, rpg: 2.0, apg: 0.6, fgPct: '35.0%', p3Pct: '28.0%', ftPct: '0.0%', height: '6\'1"', weight: '175 lbs', college: 'NYU', status: 'Season 1 Full Field Member', img: 'assets/blakeney.jpg', bio: 'Season 1 3-and-D wing playing key minutes across all 6 Mission Dolores games.' },
    { id: 'p3', name: 'Arjun Virmani', nickname: '', jersey: '#10', pos: 'Guard', ppg: 8.8, rpg: 2.5, apg: 1.0, fgPct: '32.0%', p3Pct: '24.0%', ftPct: '80.0%', height: '6\'3"', weight: '185 lbs', college: 'Stanford', status: 'Season 1 Full Field Member', img: 'assets/lin_wei.jpg', bio: 'Perimeter threat anchoring the Season 1 full field rotation.' },
    { id: 'p11', name: 'Markus Wong', nickname: 'TITANIC', jersey: '#34', pos: 'Guard', ppg: 1.5, rpg: 1.0, apg: 0.3, fgPct: '20.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'0"', weight: '170 lbs', college: 'UC Irvine', status: 'Season 1 Recommended Member', img: 'assets/lin_wei.jpg', bio: 'Season 1 backcourt reserve providing energy and bench defense.' },
    { id: 'p4', name: 'Sidharth Dudyala', nickname: 'APE', jersey: '#35', pos: 'Center', ppg: 3.0, rpg: 5.5, apg: 0.2, fgPct: '38.0%', p3Pct: '0.0%', ftPct: '40.0%', height: '6\'9"', weight: '235 lbs', college: 'USC', status: 'Season 1 Recommended Member', img: 'assets/logo.webp', bio: 'Season 1 paint protector and glass cleaner at Mission Dolores Court.' },
    { id: 'p9', name: 'Yash Sharma', nickname: 'Smoove', jersey: '#0', pos: 'Forward', ppg: 2.0, rpg: 1.5, apg: 0.2, fgPct: '40.0%', p3Pct: '0.0%', ftPct: '0.0%', height: '6\'6"', weight: '205 lbs', college: 'San Jose State', status: 'Season 1 Recommended Member', img: 'assets/hero.jpg', bio: 'Season 1 wing forward providing efficient interior scoring.' }
];

const DATA_SCHEDULE_SEASON1 = [
    { date: 'JUN 29 • 19:30', opp: "Adam Silvers' Hairstylist", venue: 'Mission Dolores Court 1', status: 'W 40-19', perf: 'Season Finale Blowout Win!', isHome: true },
    { date: 'JUN 22 • 18:30', opp: 'Love Generation', venue: 'Mission Dolores Court 1', status: 'L 30-62', perf: 'Team High (30 pts)', isHome: false },
    { date: 'JUN 15 • 21:30', opp: "Drummond's Finger Roll", venue: 'Mission Dolores Court 1', status: 'L 36-50', perf: 'Team Effort (36 pts)', isHome: true },
    { date: 'JUN 08 • 21:30', opp: "Ja's Shooters", venue: 'Mission Dolores Court 1', status: 'L 27-46', perf: 'Defensive Battle', isHome: false },
    { date: 'JUN 01 • 20:30', opp: 'Clutch Time', venue: 'Mission Dolores Court 1', status: 'L 40-42', perf: 'Heartbreaker (40-42)', isHome: true },
    { date: 'MAY 18 • 19:30', opp: 'buckets', venue: 'Mission Dolores Court 1', status: 'L 37-55', perf: 'Season 1 Opener (37 pts)', isHome: false }
];

const DATA_STATS_SEASON1 = [
    { id: 'p2', name: 'Kevin Chen', pos: 'SG', gp: 6, mpg: '24.0', ppg: 9.5, rpg: 4.0, apg: 1.8, spg: 1.0, bpg: 0.2, fg: '35.0%', p3: '25.0%' },
    { id: 'p3', name: 'Arjun Virmani', pos: 'SG', gp: 6, mpg: '22.0', ppg: 8.8, rpg: 2.5, apg: 1.0, spg: 1.0, bpg: 0.5, fg: '32.0%', p3: '24.0%' },
    { id: 'p1', name: 'Brendan Wong', pos: 'PG', gp: 6, mpg: '24.0', ppg: 8.2, rpg: 3.1, apg: 2.8, spg: 1.2, bpg: 0.0, fg: '36.5%', p3: '30.0%' },
    { id: 'p7', name: 'Max Lee (C)', pos: 'SF', gp: 6, mpg: '26.0', ppg: 7.5, rpg: 4.2, apg: 1.5, spg: 1.1, bpg: 0.3, fg: '38.0%', p3: '28.0%' },
    { id: 'p6', name: 'Kenneth Liou', pos: 'PF', gp: 6, mpg: '20.0', ppg: 5.0, rpg: 6.5, apg: 0.8, spg: 0.5, bpg: 0.8, fg: '40.0%', p3: '0.0%' },
    { id: 'p12', name: 'Thomas Ngo', pos: 'PG', gp: 6, mpg: '18.0', ppg: 4.2, rpg: 1.5, apg: 1.2, spg: 0.8, bpg: 0.0, fg: '28.0%', p3: '22.0%' },
    { id: 'p15', name: 'Stephen Zhong', pos: 'SF', gp: 5, mpg: '16.0', ppg: 4.0, rpg: 3.0, apg: 0.5, spg: 0.4, bpg: 0.2, fg: '33.0%', p3: '20.0%' },
    { id: 'p8', name: 'Xuanyi Wang', pos: 'SG', gp: 6, mpg: '16.0', ppg: 3.8, rpg: 2.0, apg: 0.6, spg: 0.5, bpg: 0.0, fg: '35.0%', p3: '28.0%' },
    { id: 'p5', name: 'Ethan Hu', pos: 'SF', gp: 6, mpg: '18.0', ppg: 3.5, rpg: 3.8, apg: 0.5, spg: 0.3, bpg: 0.2, fg: '22.0%', p3: '15.0%' },
    { id: 'p4', name: 'Sidharth Dudyala', pos: 'C', gp: 6, mpg: '18.0', ppg: 3.0, rpg: 5.5, apg: 0.2, spg: 0.8, bpg: 1.5, fg: '38.0%', p3: '0.0%' }
];

const DATA_STANDINGS_SEASON1 = [
    { rk: 1, team: 'buckets', w: 8, l: 0, pct: '1.000', gb: '-', home: '4-0', away: '4-0', strk: 'W8', l10: '8-0' },
    { rk: 2, team: "Drummond's Finger Roll", w: 6, l: 2, pct: '.750', gb: '2.0', home: '3-1', away: '3-1', strk: 'W2', l10: '6-2' },
    { rk: 3, team: 'Love Generation', w: 4, l: 3, pct: '.571', gb: '3.5', home: '2-1', away: '2-2', strk: 'W1', l10: '4-3' },
    { rk: 4, team: 'KDs Burner', w: 3, l: 4, pct: '.429', gb: '4.5', home: '2-2', away: '1-2', strk: 'L1', l10: '3-4' },
    { rk: 5, team: "Ja's Shooters", w: 3, l: 3, pct: '.500', gb: '4.0', home: '2-1', away: '1-2', strk: 'L1', l10: '3-3' },
    { rk: 6, team: 'Clutch Time', w: 2, l: 4, pct: '.333', gb: '5.0', home: '1-2', away: '1-2', strk: 'L2', l10: '2-4' },
    { rk: 7, team: 'Nanjing Monkey Kings', w: 1, l: 5, pct: '.167', gb: '6.0', home: '1-2', away: '0-3', strk: 'W1', l10: '1-5', highlight: true },
    { rk: 8, team: "Adam Silvers' Hairstylist", w: 0, l: 6, pct: '.000', gb: '7.0', home: '0-3', away: '0-3', strk: 'L6', l10: '0-6' }
];

// ==========================================================================
// OFFICIAL VERIFIED SEASON 2 PLAYER GAME LOGS (FROM VOLO STAT TRACKER)
// ==========================================================================
const PLAYER_GAME_LOGS = {
    'p1': [ // Brendan Wong
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 11, fgm: 5, fga: 17, p3m: 0, p3a: 6, ftm: 1, fta: 5, dreb: 4, oreb: 0, reb: 4, ast: 3, stl: 1, blk: 0, to: 3 }
    ],
    'p2': [ // Kevin Chen
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 15, fgm: 6, fga: 16, p3m: 1, p3a: 2, ftm: 2, fta: 8, dreb: 6, oreb: 0, reb: 6, ast: 1, stl: 1, blk: 0, to: 2 },
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 7, fgm: 2, fga: 12, p3m: 0, p3a: 3, ftm: 3, fta: 13, dreb: 4, oreb: 1, reb: 5, ast: 2, stl: 2, blk: 0, to: 3 }
    ],
    'p3': [ // Arjun Virmani
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 11, fgm: 4, fga: 19, p3m: 0, p3a: 10, ftm: 3, fta: 3, dreb: 4, oreb: 0, reb: 4, ast: 1, stl: 1, blk: 0, to: 1 },
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 11, fgm: 4, fga: 21, p3m: 3, p3a: 12, ftm: 0, fta: 0, dreb: 1, oreb: 0, reb: 1, ast: 1, stl: 3, blk: 0, to: 4 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 18, fgm: 6, fga: 12, p3m: 4, p3a: 6, ftm: 2, fta: 2, dreb: 4, oreb: 1, reb: 5, ast: 1, stl: 0, blk: 1, to: 3 }
    ],
    'p4': [ // Sidharth Dudyala
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 4, fgm: 2, fga: 5, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 6, oreb: 3, reb: 9, ast: 0, stl: 3, blk: 2, to: 2 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 3, fgm: 1, fga: 3, p3m: 0, p3a: 0, ftm: 1, fta: 2, dreb: 4, oreb: 3, reb: 7, ast: 0, stl: 3, blk: 4, to: 6 }
    ],
    'p5': [ // Ethan Hu
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 0, fgm: 0, fga: 5, p3m: 0, p3a: 4, ftm: 0, fta: 0, dreb: 2, oreb: 0, reb: 2, ast: 0, stl: 0, blk: 0, to: 1 },
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 4, fgm: 1, fga: 9, p3m: 1, p3a: 6, ftm: 1, fta: 2, dreb: 3, oreb: 3, reb: 6, ast: 1, stl: 0, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 1, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 3, oreb: 0, reb: 3, ast: 0, stl: 0, blk: 0, to: 3 }
    ],
    'p6': [ // Kenneth Liou
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 0, fgm: 0, fga: 4, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 5, oreb: 1, reb: 6, ast: 0, stl: 1, blk: 0, to: 0 },
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 4, fgm: 1, fga: 2, p3m: 0, p3a: 0, ftm: 2, fta: 3, dreb: 3, oreb: 5, reb: 8, ast: 2, stl: 2, blk: 0, to: 1 }
    ],
    'p7': [ // Max Lee
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 0, fgm: 0, fga: 7, p3m: 0, p3a: 7, ftm: 0, fta: 0, dreb: 2, oreb: 1, reb: 3, ast: 0, stl: 0, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 4, p3m: 0, p3a: 3, ftm: 0, fta: 0, dreb: 3, oreb: 2, reb: 5, ast: 1, stl: 1, blk: 0, to: 2 }
    ],
    'p8': [ // Xuanyi Wang
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 5, fgm: 2, fga: 4, p3m: 1, p3a: 3, ftm: 0, fta: 0, dreb: 4, oreb: 1, reb: 5, ast: 0, stl: 1, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 1, p3m: 0, p3a: 0, ftm: 0, fta: 0, dreb: 0, oreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0 }
    ],
    'p9': [ // Yash Sharma
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 6, fgm: 3, fga: 5, p3m: 0, p3a: 0, ftm: 0, fta: 0, dreb: 1, oreb: 0, reb: 1, ast: 0, stl: 1, blk: 1, to: 0 }
    ],
    'p10': [ // Vaishik Kota
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 3, fgm: 1, fga: 5, p3m: 0, p3a: 1, ftm: 1, fta: 3, dreb: 9, oreb: 3, reb: 12, ast: 1, stl: 0, blk: 0, to: 1 }
    ],
    'p11': [ // Markus Wong
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 0, fgm: 0, fga: 2, p3m: 0, p3a: 0, ftm: 0, fta: 0, dreb: 0, oreb: 0, reb: 0, stl: 0, blk: 0, to: 0 },
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 0, fgm: 0, fga: 0, p3m: 0, p3a: 0, ftm: 0, fta: 0, dreb: 0, oreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 0, p3m: 0, p3a: 0, ftm: 0, fta: 0, dreb: 0, oreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 1 }
    ],
    'p12': [ // Thomas Ngo
        { gameId: 1, date: '07/20/2026', opp: 'White', result: 'L 31-67', pts: 0, fgm: 0, fga: 3, p3m: 0, p3a: 3, ftm: 0, fta: 0, dreb: 1, oreb: 0, reb: 1, ast: 0, stl: 0, blk: 0, to: 0 },
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 3, fgm: 1, fga: 3, p3m: 1, p3a: 1, ftm: 0, fta: 0, dreb: 0, oreb: 1, reb: 1, ast: 1, stl: 0, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 4, p3m: 0, p3a: 2, ftm: 0, fta: 0, dreb: 0, oreb: 1, reb: 1, ast: 0, stl: 0, blk: 0, to: 0 }
    ],
    'p13': [ // Will Park
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 0, fgm: 0, fga: 2, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 2, oreb: 0, reb: 2, ast: 0, stl: 1, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 2, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 4, oreb: 0, reb: 4, ast: 0, stl: 0, blk: 0, to: 1 }
    ],
    'p14': [ // Steven Ngo
        { gameId: 2, date: '07/27/2026', opp: 'Green', result: 'L 33-38', pts: 0, fgm: 0, fga: 1, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 0, oreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0 },
        { gameId: 3, date: '08/03/2026', opp: 'Blue', result: 'W 41-38', pts: 0, fgm: 0, fga: 1, p3m: 0, p3a: 1, ftm: 0, fta: 0, dreb: 1, oreb: 1, reb: 1, ast: 0, stl: 0, blk: 0, to: 0 }
    ]
};

const DATA_FILM = [
    { title: 'Arjun Virmani 18-Point Outburst (4 3PM) vs Team Blue', duration: '03:45', views: '4.2K views', img: 'assets/lin_wei.jpg', video: 'assets/film/IMG_0841.mp4' },
    { title: 'Kevin Chen 15-Point Opener Performance vs Team White', duration: '04:12', views: '3.8K views', img: 'assets/blakeney.jpg', video: 'assets/film/IMG_6165.mp4' },
    { title: 'Vaishik Kota 12-Rebound Monster Glass Clean vs Blue', duration: '05:15', views: '2.9K views', img: 'assets/logo.webp', video: 'assets/film/IMG_6166.mp4' },
    { title: 'Top Defensive Plays: Sidharth Dudyala 4-Block 3-Steal Game', duration: '06:30', views: '3.4K views', img: 'assets/hero.jpg', video: 'assets/film/IMG_0841.mp4' }
];

const DATA_PROPS = [
    { id: 'pr1', player: 'Arjun Virmani', stat: 'Points Scored', line: '14.5', matchup: 'vs Gold Lions' },
    { id: 'pr2', player: 'Brendan Wong', stat: 'Points + Assists', line: '14.5', matchup: 'vs Gold Lions' },
    { id: 'pr3', player: 'Vaishik Kota', stat: 'Total Rebounds', line: '9.5', matchup: 'vs Gold Lions' },
    { id: 'pr4', player: 'Kevin Chen', stat: 'Points Scored', line: '11.5', matchup: 'vs Gold Lions' }
];

// 2. STATE MANAGEMENT
let currentUser = null;
let selectedProps = {};
let activeSeason = 'season2';

function changeSeason(seasonVal) {
    activeSeason = seasonVal;
    const badge = document.getElementById('current-season-badge');
    
    if (seasonVal === 'season1') {
        if (badge) badge.innerText = 'SEASON 1 (MAY 18 - JUN 29 • 6 WEEKS)';
    } else {
        if (badge) badge.innerText = 'SEASON 2 (JUL 20 - SEP 7 • 7 WEEKS)';
    }

    renderSchedule();
    renderRoster();
    renderStats();
    renderStandings();
}

// INITIALIZE APP ON LOAD
window.addEventListener('DOMContentLoaded', () => {
    checkAuthSession();
    renderSchedule();
    renderRoster();
    renderStats();
    renderStandings();
    renderFilm();
    renderProps();
    startCountdownTimer();
    handleHashRoute();
});

/* ==========================================================================
   AUTHENTICATION ENGINE
   ========================================================================== */

function checkAuthSession() {
    const savedUser = localStorage.getItem('monkey_kings_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        unlockAppUI();
    } else {
        lockAppUI();
    }
}

function lockAppUI() {
    document.body.classList.add('auth-locked');
    document.getElementById('auth-portal').classList.add('active');
}

function unlockAppUI() {
    document.body.classList.remove('auth-locked');
    document.getElementById('auth-portal').classList.remove('active');
    
    // Update Header User Details
    document.getElementById('user-display-name').innerText = currentUser.name || 'Fan User';
    document.getElementById('user-tokens-count').innerText = `🏆 ${(currentUser.tokens || 1250).toLocaleString()} PTS`;
    document.getElementById('user-lb-name').innerText = `${currentUser.name || 'You'} (You)`;
    document.getElementById('user-lb-score').innerText = `${(currentUser.tokens || 1250).toLocaleString()} PTS`;
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    document.getElementById(`tab-${tab}-btn`).classList.add('active');
    document.getElementById(`form-${tab}`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const name = email.split('@')[0] || 'Fan User';
    
    currentUser = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        tokens: 1250
    };
    
    localStorage.setItem('monkey_kings_user', JSON.stringify(currentUser));
    unlockAppUI();
}

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const fav = document.getElementById('signup-fav-player').value;

    currentUser = {
        name: name,
        email: email,
        favPlayer: fav,
        tokens: 1500
    };

    localStorage.setItem('monkey_kings_user', JSON.stringify(currentUser));
    alert(`🎉 Account created! Welcome to Nanjing Monkey Kings Fan Hub, ${name}! (+250 Bonus Tokens awarded)`);
    unlockAppUI();
}

function handleDemoLogin() {
    currentUser = {
        name: 'Demo Monkey King',
        email: 'demo@monkeykings.com',
        tokens: 1250
    };
    localStorage.setItem('monkey_kings_user', JSON.stringify(currentUser));
    unlockAppUI();
}

function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('monkey_kings_user');
        currentUser = null;
        lockAppUI();
    }
}

/* ==========================================================================
   NAVIGATION ROUTER (BROWSER HISTORY & HASH ROUTING)
   ========================================================================== */

function navigateSection(sectionId, updateHash = true) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));

    const tabBtn = document.getElementById(`nav-${sectionId}`);
    if (tabBtn) tabBtn.classList.add('active');

    const secElem = document.getElementById(`section-${sectionId}`);
    if (secElem) secElem.classList.add('active');

    if (updateHash && window.location.hash !== `#${sectionId}`) {
        window.history.pushState({ section: sectionId }, '', `#${sectionId}`);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getPlayerSlug(name) {
    if (!name) return '';
    return name.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function handleHashRoute() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) {
        navigateSection('home', false);
        return;
    }

    if (hash.startsWith('player-bio/')) {
        const playerSlug = hash.replace('player-bio/', '');
        openPlayerBioPage(playerSlug, false);
    } else if (hash.startsWith('game/')) {
        const gameSlug = hash.replace('game/', '');
        openGamePage(gameSlug, false);
    } else {
        const knownSections = ['home', 'schedule', 'roster', 'stats', 'standings', 'film', 'player-props', 'player-bio', 'game'];
        if (knownSections.includes(hash)) {
            navigateSection(hash, false);
        } else {
            navigateSection('home', false);
        }
    }
}

window.addEventListener('popstate', handleHashRoute);

/* ==========================================================================
   DEDICATED GAME MATCH CENTER & BOX SCORE ENGINE (ESPN-STYLE)
   ========================================================================== */

function openGamePage(gameSlugOrId, updateHash = true) {
    const isSeason1 = activeSeason === 'season1' || gameSlugOrId.toString().startsWith('season1-');
    const scheduleSource = isSeason1 ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2;
    const rosterSource = isSeason1 ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;
    
    // Extract Game Index or Game ID
    const cleanId = gameSlugOrId.toString().replace(/^(season1-|game-)/, '');
    let g = scheduleSource.find((item, idx) => (idx + 1).toString() === cleanId || item.opp.toLowerCase().includes(cleanId.toLowerCase()));
    if (!g && scheduleSource.length > 0) g = scheduleSource[0];
    if (!g) return;

    const gameIndex = scheduleSource.indexOf(g) + 1;
    const gameSlug = isSeason1 ? `season1-game${gameIndex}` : `game-${gameIndex}`;
    const container = document.getElementById('game-page-content');
    
    // Find player stats for this game
    const boxscorePlayers = [];
    let tPts = 0, tFgm = 0, tFga = 0, tP3m = 0, tP3a = 0, tFtm = 0, tFta = 0, tDreb = 0, tOreb = 0, tReb = 0, tAst = 0, tStl = 0, tBlk = 0, tTo = 0;

    rosterSource.forEach(p => {
        const pLogs = PLAYER_GAME_LOGS[p.id] || [];
        const matchLog = pLogs.find(log => log.gameId === gameIndex || log.opp === g.opp);
        
        if (matchLog) {
            boxscorePlayers.push({ player: p, log: matchLog });
            tPts += matchLog.pts;
            tFgm += matchLog.fgm;
            tFga += matchLog.fga;
            tP3m += matchLog.p3m;
            tP3a += matchLog.p3a;
            tFtm += matchLog.ftm;
            tFta += matchLog.fta;
            tDreb += matchLog.dreb;
            tOreb += matchLog.oreb;
            tReb += matchLog.reb;
            tAst += matchLog.ast;
            tStl += matchLog.stl;
            tBlk += matchLog.blk;
            tTo += matchLog.to;
        }
    });

    const isWin = g.status.includes('W');
    const isUpcoming = g.status === 'UPCOMING';
    
    let nanjingScore = '--';
    let oppScore = '--';
    if (!isUpcoming) {
        const scoreParts = g.status.replace(/^[WL]\s*/, '').split('-');
        if (scoreParts.length === 2) {
            nanjingScore = parseInt(scoreParts[0]) || 0;
            oppScore = parseInt(scoreParts[1]) || 0;
        }
    }

    let boxRowsHTML = '';
    if (boxscorePlayers.length === 0) {
        boxRowsHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Individual player box score details were unrecorded for this matchup.</td></tr>`;
    } else {
        boxscorePlayers.forEach(b => {
            const p = b.player;
            const l = b.log;
            const slug = getPlayerSlug(p.name);
            boxRowsHTML += `
                <tr>
                    <td><strong class="player-boxscore-name" onclick="openPlayerBioPage('${slug}')">${p.name}</strong> <span style="font-size: 0.75rem; color: var(--text-muted);">(${p.pos})</span></td>
                    <td><strong class="gold-text">${l.pts}</strong></td>
                    <td>${l.fgm}-${l.fga}</td>
                    <td>${l.p3m}-${l.p3a}</td>
                    <td>${l.ftm}-${l.fta}</td>
                    <td>${l.reb} (${l.dreb}/${l.oreb})</td>
                    <td>${l.ast}</td>
                    <td>${l.stl}</td>
                    <td>${l.blk}</td>
                    <td>${l.to}</td>
                </tr>
            `;
        });
    }

    const fgPctStr = tFga > 0 ? ((tFgm / tFga) * 100).toFixed(1) + '%' : '0.0%';
    const p3PctStr = tP3a > 0 ? ((tP3m / tP3a) * 100).toFixed(1) + '%' : '0.0%';
    const ftPctStr = tFta > 0 ? ((tFtm / tFta) * 100).toFixed(1) + '%' : '0.0%';

    container.innerHTML = `
        <!-- GAME SCOREBOARD HERO CARD -->
        <div class="game-hero-card">
            <div class="game-meta-bar">
                <span class="game-status-tag ${isUpcoming ? 'upcoming' : ''}">${isUpcoming ? 'UPCOMING TIP-OFF' : 'FINAL BOX SCORE'}</span>
                <span class="game-date-venue">📅 ${g.date} • 📍 ${g.venue} • ${isSeason1 ? 'SEASON 1' : 'SEASON 2'}</span>
            </div>

            <div class="game-matchup-grid">
                <!-- NANJING MONKEY KINGS -->
                <div class="team-side home">
                    <img src="assets/logo.webp" alt="Nanjing Monkey Kings" class="game-team-logo">
                    <div class="team-name-box">
                        <h2>Nanjing Monkey Kings</h2>
                        <span class="team-record">${isSeason1 ? 'Season 1 (1-5)' : 'Season 2 (1-2)'}</span>
                    </div>
                    <span class="team-score ${isWin ? 'winner' : ''}">${nanjingScore}</span>
                </div>

                <div class="vs-divider">VS</div>

                <!-- OPPONENT -->
                <div class="team-side away">
                    <span class="team-score ${!isWin && !isUpcoming ? 'winner' : ''}">${oppScore}</span>
                    <div class="team-name-box" style="text-align: right;">
                        <h2>${g.opp}</h2>
                        <span class="team-record">Opponent</span>
                    </div>
                    <div class="game-opp-logo-placeholder">🏀</div>
                </div>
            </div>

            ${!isUpcoming ? `
            <!-- HALF-BY-HALF LINE SCORE -->
            <div class="linescore-wrapper">
                <table class="espn-table linescore-table">
                    <thead>
                        <tr>
                            <th>TEAM</th>
                            <th>1ST HALF</th>
                            <th>2ND HALF</th>
                            <th>TOTAL PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="${isWin ? 'highlight-row' : ''}">
                            <td><strong>🏀 Nanjing Monkey Kings</strong></td>
                            <td>${Math.round(nanjingScore * 0.45)}</td>
                            <td>${nanjingScore - Math.round(nanjingScore * 0.45)}</td>
                            <td><strong class="gold-text">${nanjingScore}</strong></td>
                        </tr>
                        <tr class="${!isWin ? 'highlight-row' : ''}">
                            <td><strong>${g.opp}</strong></td>
                            <td>${Math.round(oppScore * 0.48)}</td>
                            <td>${oppScore - Math.round(oppScore * 0.48)}</td>
                            <td><strong>${oppScore}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            ` : ''}
        </div>

        ${!isUpcoming ? `
        <!-- TEAM COMPARISON & SHOOTING EFFICIENCY -->
        <div class="bio-card-box">
            <h3>📊 NANJING TEAM SHOOTING & STATISTICAL BREAKDOWN</h3>
            <div class="bio-stats-summary-grid">
                <div class="bio-stat-box"><span class="label">TOTAL PTS</span><strong class="gold-text">${tPts}</strong></div>
                <div class="bio-stat-box"><span class="label">FG EFFICIENCY</span><strong>${fgPctStr} (${tFgm}/${tFga})</strong></div>
                <div class="bio-stat-box"><span class="label">3PT SHOOTING</span><strong>${p3PctStr} (${tP3m}/${tP3a})</strong></div>
                <div class="bio-stat-box"><span class="label">FT SHOOTING</span><strong>${ftPctStr} (${tFtm}/${tFta})</strong></div>
                <div class="bio-stat-box"><span class="label">REBOUNDS</span><strong>${tReb} (${tDreb}/${tOreb})</strong></div>
                <div class="bio-stat-box"><span class="label">ASSISTS / TO</span><strong>${tAst} / ${tTo}</strong></div>
            </div>
        </div>

        <!-- PLAYER BOX SCORE TABLE -->
        <div class="bio-card-box">
            <h3>📋 OFFICIAL PLAYER BOX SCORE SHEET</h3>
            <div class="schedule-table-wrapper">
                <table class="espn-table">
                    <thead>
                        <tr>
                            <th>PLAYER</th>
                            <th>PTS</th>
                            <th>FGM-A</th>
                            <th>3PM-A</th>
                            <th>FTM-A</th>
                            <th>REB (D/O)</th>
                            <th>AST</th>
                            <th>STL</th>
                            <th>BLK</th>
                            <th>TO</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${boxRowsHTML}
                        ${boxscorePlayers.length > 0 ? `
                        <tr style="background: var(--navy-dark); font-weight: 800; border-top: 2px solid var(--gold-accent);">
                            <td><strong>TEAM TOTALS</strong></td>
                            <td><strong class="gold-text">${tPts}</strong></td>
                            <td>${tFgm}-${tFga}</td>
                            <td>${tP3m}-${tP3a}</td>
                            <td>${tFtm}-${tFta}</td>
                            <td>${tReb} (${tDreb}/${tOreb})</td>
                            <td>${tAst}</td>
                            <td>${tStl}</td>
                            <td>${tBlk}</td>
                            <td>${tTo}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
        ` : `
        <div class="bio-card-box">
            <h3>🎟️ GAME INFORMATION</h3>
            <p>Tip-off is scheduled for <strong>${g.date}</strong> at <strong>${g.venue}</strong>. Fan predictions and player prop picks are now open!</p>
        </div>
        `}
    `;

    navigateSection('game', false);

    if (updateHash && window.location.hash !== `#game/${gameSlug}`) {
        window.history.pushState({ section: 'game', gameSlug }, '', `#game/${gameSlug}`);
    }
}

/* ==========================================================================
   DEDICATED PLAYER BIO PAGE ENGINE
   ========================================================================== */

function openPlayerBioPage(playerSlugOrId, updateHash = true) {
    const rosterSource = activeSeason === 'season1' ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;
    const cleanQuery = playerSlugOrId.toString().toLowerCase();

    const p = rosterSource.find(item => getPlayerSlug(item.name) === cleanQuery || item.id === cleanQuery) 
           || DATA_ROSTER_SEASON2.find(item => getPlayerSlug(item.name) === cleanQuery || item.id === cleanQuery)
           || rosterSource.find(item => item.name.toLowerCase().includes(cleanQuery.replace('-', ' ')));
           
    if (!p) return;

    const slug = getPlayerSlug(p.name);
    const logs = PLAYER_GAME_LOGS[p.id] || [];
    const container = document.getElementById('player-bio-page-content');

    // Build Game Log Rows
    let logRowsHTML = '';
    if (logs.length === 0) {
        logRowsHTML = `<tr><td colspan="12" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No official game appearances recorded for this player in ${activeSeason.toUpperCase()}.</td></tr>`;
    } else {
        logs.forEach(g => {
            logRowsHTML += `
                <tr>
                    <td><strong>Game ${g.gameId}</strong></td>
                    <td>${g.date}</td>
                    <td>${g.opp}</td>
                    <td><span class="${g.result.includes('W') ? 'stat-pill highlight' : 'stat-pill'}">${g.result}</span></td>
                    <td><strong class="gold-text">${g.pts}</strong></td>
                    <td>${g.fgm}-${g.fga}</td>
                    <td>${g.p3m}-${g.p3a}</td>
                    <td>${g.ftm}-${g.fta}</td>
                    <td>${g.reb} (${g.dreb}/${g.oreb})</td>
                    <td>${g.ast}</td>
                    <td>${g.stl}</td>
                    <td>${g.blk}</td>
                </tr>
            `;
        });
    }

    container.innerHTML = `
        <!-- HERO PROFILE HEADER -->
        <div class="bio-hero-header">
            <img src="${p.img}" alt="${p.name}" class="bio-hero-img">
            <div class="bio-hero-info">
                <span class="bio-jersey-badge">${p.jersey}</span>
                <h2>${p.name}</h2>
                <p class="bio-sub-title">Nanjing Monkey Kings • ${p.pos} • ${activeSeason.toUpperCase()}</p>
                <div class="vitals-row">
                    ${p.nickname ? `<div class="vital-chip highlight"><span>NICKNAME:</span> <strong>"${p.nickname}"</strong></div>` : ''}
                    <div class="vital-chip"><span>HEIGHT:</span> <strong>${p.height}</strong></div>
                    <div class="vital-chip"><span>WEIGHT:</span> <strong>${p.weight}</strong></div>
                    <div class="vital-chip"><span>COLLEGE:</span> <strong>${p.college}</strong></div>
                    <div class="vital-chip highlight"><span>STATUS:</span> <strong>${p.status}</strong></div>
                </div>
            </div>
        </div>

        <!-- BIOGRAPHY PARAGRAPH -->
        <div class="bio-card-box">
            <h3>📖 PLAYER BIOGRAPHY</h3>
            <p>${p.bio}</p>
        </div>

        <!-- SEASON STATS SUMMARY GRID -->
        <div class="bio-card-box">
            <h3>📊 ${activeSeason.toUpperCase()} STATISTICAL AVERAGES</h3>
            <div class="bio-stats-summary-grid">
                <div class="bio-stat-box"><span class="label">PPG</span><strong class="gold-text">${p.ppg}</strong></div>
                <div class="bio-stat-box"><span class="label">RPG</span><strong>${p.rpg}</strong></div>
                <div class="bio-stat-box"><span class="label">APG</span><strong>${p.apg}</strong></div>
                <div class="bio-stat-box"><span class="label">FG%</span><strong>${p.fgPct || '0.0%'}</strong></div>
                <div class="bio-stat-box"><span class="label">3P%</span><strong>${p.p3Pct || '0.0%'}</strong></div>
                <div class="bio-stat-box"><span class="label">FT%</span><strong>${p.ftPct || '0.0%'}</strong></div>
            </div>
        </div>

        <!-- PER-GAME LOG TABLE -->
        <div class="bio-card-box">
            <h3>📅 ${activeSeason.toUpperCase()} GAME-BY-GAME LOG</h3>
            <div class="schedule-table-wrapper">
                <table class="espn-table">
                    <thead>
                        <tr>
                            <th>GAME</th>
                            <th>DATE</th>
                            <th>OPPONENT</th>
                            <th>RESULT</th>
                            <th>PTS</th>
                            <th>FGM-A</th>
                            <th>3PM-A</th>
                            <th>FTM-A</th>
                            <th>REB (D/O)</th>
                            <th>AST</th>
                            <th>STL</th>
                            <th>BLK</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logRowsHTML}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    navigateSection('player-bio', false);

    if (updateHash && window.location.hash !== `#player-bio/${slug}`) {
        window.history.pushState({ section: 'player-bio', playerSlug: slug }, '', `#player-bio/${slug}`);
    }
}

/* ==========================================================================
   DATA RENDERERS
   ========================================================================== */

// 1. RENDER SCHEDULE
function renderSchedule(filter = 'all') {
    const tbody = document.getElementById('schedule-tbody');
    tbody.innerHTML = '';

    const sourceData = activeSeason === 'season1' ? DATA_SCHEDULE_SEASON1 : DATA_SCHEDULE_SEASON2;

    const list = sourceData.filter(item => {
        if (filter === 'upcoming') return item.status === 'UPCOMING';
        if (filter === 'results') return item.status !== 'UPCOMING';
        return true;
    });

    list.forEach(m => {
        const gameIndex = sourceData.indexOf(m) + 1;
        const hasBoxScore = activeSeason === 'season2' && m.status !== 'UPCOMING';
        const tr = document.createElement('tr');

        if (hasBoxScore) {
            tr.className = 'clickable';
            tr.onclick = () => openGamePage(`game-${gameIndex}`);
        } else {
            tr.style.cursor = 'default';
        }

        tr.innerHTML = `
            <td><strong>${m.date}</strong></td>
            <td>${m.isHome ? '<strong>vs</strong>' : '@'} ${m.opp}</td>
            <td>${m.venue}</td>
            <td><span class="${m.status.includes('W') ? 'stat-pill highlight' : 'stat-pill'}">${m.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function filterSchedule(type) {
    document.querySelectorAll('#section-schedule .filter-chip').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderSchedule(type);
}

// 2. RENDER ROSTER
function renderRoster(posFilter = 'all') {
    const grid = document.getElementById('roster-grid');
    grid.innerHTML = '';

    const sourceData = activeSeason === 'season1' ? DATA_ROSTER_SEASON1 : DATA_ROSTER_SEASON2;

    const list = sourceData.filter(p => {
        if (posFilter === 'guard') return p.pos.includes('Guard');
        if (posFilter === 'forward') return p.pos.includes('Forward');
        if (posFilter === 'center') return p.pos.includes('Center');
        return true;
    });

    list.forEach(p => {
        const slug = getPlayerSlug(p.name);
        const card = document.createElement('div');
        card.className = 'player-card-box';
        card.onclick = () => openPlayerBioPage(slug);
        card.innerHTML = `
            <div class="player-img-container">
                <img src="${p.img}" alt="${p.name}">
                <span class="jersey-badge">${p.jersey}</span>
            </div>
            <div class="player-details-box">
                <h3>${p.name}</h3>
                <span class="pos-tag">${p.pos} • ${p.height}</span>
                <div class="mini-stats-grid">
                    <div class="mini-stat"><label>PPG</label><span>${p.ppg}</span></div>
                    <div class="mini-stat"><label>RPG</label><span>${p.rpg}</span></div>
                    <div class="mini-stat"><label>APG</label><span>${p.apg}</span></div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterRoster(pos) {
    document.querySelectorAll('#section-roster .filter-chip').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderRoster(pos);
}

// 3. RENDER STATS
function renderStats() {
    const tbody = document.getElementById('stats-tbody');
    tbody.innerHTML = '';

    const sourceData = activeSeason === 'season1' ? DATA_STATS_SEASON1 : DATA_STATS_SEASON2;

    sourceData.forEach(s => {
        const slug = getPlayerSlug(s.name);
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => openPlayerBioPage(slug);
        tr.innerHTML = `
            <td><strong class="gold-text">${s.name} 👤</strong></td>
            <td>${s.pos}</td>
            <td>${s.gp}</td>
            <td>${s.mpg}</td>
            <td><strong>${s.ppg}</strong></td>
            <td>${s.rpg}</td>
            <td>${s.apg}</td>
            <td>${s.spg}</td>
            <td>${s.bpg}</td>
            <td>${s.fg}</td>
            <td>${s.p3}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. RENDER STANDINGS
function renderStandings() {
    const tbody = document.getElementById('standings-tbody');
    tbody.innerHTML = '';

    const sourceData = activeSeason === 'season1' ? DATA_STANDINGS_SEASON1 : DATA_STANDINGS_SEASON2;

    sourceData.forEach(st => {
        const tr = document.createElement('tr');
        if (st.highlight) tr.className = 'highlight-row';
        tr.innerHTML = `
            <td><strong>${st.rk}</strong></td>
            <td>${st.highlight ? '🏀 ' : ''}<strong>${st.team}</strong></td>
            <td>${st.w}</td>
            <td>${st.l}</td>
            <td>${st.pct}</td>
            <td>${st.gb}</td>
            <td>${st.home}</td>
            <td>${st.away}</td>
            <td><span class="${st.strk.includes('W') ? 'stat-pill highlight' : 'stat-pill'}">${st.strk}</span></td>
            <td>${st.l10}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. RENDER FILM
function renderFilm() {
    const grid = document.getElementById('film-grid');
    grid.innerHTML = '';
    DATA_FILM.forEach(f => {
        const card = document.createElement('div');
        card.className = 'film-card';
        card.onclick = () => openVideoModal(f.title, f.video);
        card.innerHTML = `
            <div class="film-thumb-box">
                <img src="${f.img}" alt="${f.title}">
                <div class="play-overlay">▶</div>
                <span class="duration-badge">${f.duration}</span>
            </div>
            <div class="film-info">
                <h3>${f.title}</h3>
                <p>${f.views} • Team Game Film</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 6. RENDER PROPS
function renderProps() {
    const container = document.getElementById('props-cards-container');
    container.innerHTML = '';

    DATA_PROPS.forEach(p => {
        const card = document.createElement('div');
        card.className = 'prop-card';
        const currentPick = selectedProps[p.id];
        
        card.innerHTML = `
            <div class="prop-player-meta">
                <h4>${p.player}</h4>
                <div class="prop-line">${p.stat} — Line: <strong>${p.line}</strong></div>
                <span class="prop-stat-desc">${p.matchup}</span>
            </div>
            <div class="prop-btns">
                <button class="btn-pick ${currentPick === 'OVER' ? 'selected-over' : ''}" onclick="togglePropPick('${p.id}', 'OVER')">OVER ${p.line}</button>
                <button class="btn-pick ${currentPick === 'UNDER' ? 'selected-under' : ''}" onclick="togglePropPick('${p.id}', 'UNDER')">UNDER ${p.line}</button>
            </div>
        `;
        container.appendChild(card);
    });

    updateBetSlipUI();
}

function togglePropPick(propId, choice) {
    if (selectedProps[propId] === choice) {
        delete selectedProps[propId];
    } else {
        selectedProps[propId] = choice;
    }
    renderProps();
}

function updateBetSlipUI() {
    const slipList = document.getElementById('slip-items-list');
    const countElem = document.getElementById('slip-count');
    const rewardElem = document.getElementById('slip-reward');

    const keys = Object.keys(selectedProps);
    countElem.innerText = keys.length;
    rewardElem.innerText = `${keys.length * 350} PTS`;

    if (keys.length === 0) {
        slipList.innerHTML = `<p class="empty-slip-text">No prop picks selected yet. Click OVER or UNDER on any player prop card to build your slip!</p>`;
        return;
    }

    slipList.innerHTML = '';
    keys.forEach(id => {
        const p = DATA_PROPS.find(item => item.id === id);
        const pick = selectedProps[id];
        const item = document.createElement('div');
        item.className = 'slip-item';
        item.innerHTML = `
            <div>
                <strong>${p.player}</strong>
                <div style="font-size: 0.75rem; color: #94A3B8;">${p.stat}</div>
            </div>
            <span class="pick-val">${pick} ${p.line}</span>
        `;
        slipList.appendChild(item);
    });
}

function submitPropSlip() {
    const count = Object.keys(selectedProps).length;
    if (count === 0) {
        alert('Please select at least 1 prop prediction before submitting your slip!');
        return;
    }

    const reward = count * 350;
    currentUser.tokens = (currentUser.tokens || 1250) + reward;
    localStorage.setItem('monkey_kings_user', JSON.stringify(currentUser));
    
    alert(`🎯 Success! Your ${count} prop predictions have been placed for tip-off! (+${reward} PTS added to your profile)`);
    selectedProps = {};
    unlockAppUI();
    renderProps();
}

/* ==========================================================================
   MODALS ENGINE
   ========================================================================== */

function openTicketModal() {
    document.getElementById('modal-ticket').classList.add('active');
}

function confirmTicketPurchase() {
    const tier = document.getElementById('ticket-tier').value;
    alert(`🎟️ Ticket Reserved! Seat Tier: ${tier}. Mobile entry QR code sent to ${currentUser.email}!`);
    closeModal('modal-ticket');
}

function openBoxScoreModal() {
    alert("🏀 Game Box Score Summary\n\nNanjing Monkey Kings vs Opponent\n- Team High Scorer: Arjun Virmani (18 PTS, 4 3PM)\n- Top Rebounder: Vaishik Kota (12 REB)\n- Lead Playmaker: Brendan Wong (3 AST, 11 PTS)");
}

function openVideoModal(title, videoSrc) {
    document.getElementById('video-modal-title').innerText = title;
    
    const playerContainer = document.querySelector('.video-placeholder-player');
    if (videoSrc) {
        playerContainer.innerHTML = `
            <video controls autoplay style="width: 100%; height: 100%; border-radius: 12px; object-fit: contain;">
                <source src="${videoSrc}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    } else {
        playerContainer.innerHTML = `
            <div class="play-icon-big">▶</div>
            <p id="video-modal-desc">${title}</p>
        `;
    }
    document.getElementById('modal-video').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

/* ==========================================================================
   COUNTDOWN TIMER ENGINE
   ========================================================================== */

function startCountdownTimer() {
    let secondsTotal = (3 * 24 * 3600) + (14 * 3600) + (22 * 60) + 45;

    setInterval(() => {
        if (secondsTotal <= 0) return;
        secondsTotal--;

        const d = Math.floor(secondsTotal / (3600 * 24));
        const h = Math.floor((secondsTotal % (3600 * 24)) / 3600);
        const m = Math.floor((secondsTotal % 3600) / 60);
        const s = Math.floor(secondsTotal % 60);

        document.getElementById('cd-days').innerText = String(d).padStart(2, '0');
        document.getElementById('cd-hours').innerText = String(h).padStart(2, '0');
        document.getElementById('cd-mins').innerText = String(m).padStart(2, '0');
        document.getElementById('cd-secs').innerText = String(s).padStart(2, '0');
    }, 1000);
}

function submitVote(opt) {
    alert(`🔥 Thanks for voting! Your pick for ${opt.toUpperCase()} has been registered in the Nanjing fan poll.`);
}
