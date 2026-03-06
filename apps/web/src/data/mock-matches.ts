export interface Team {
  name: string;
  shortName: string;
}

export interface Odds {
  home: number;
  draw?: number;
  away: number;
  over25?: number;
  under25?: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  league: string;
  sport: string;
  odds: Odds;
  isLive: boolean;
  minute?: number;
  score?: { home: number; away: number };
  startTime: string;
  isFeatured?: boolean;
  popularity?: number;
}

export interface Sport {
  id: string;
  name: string;
  icon: string;
  eventCount: number;
}

export interface League {
  id: string;
  name: string;
  sport: string;
  country: string;
}

export const SPORTS: Sport[] = [
  { id: "football", name: "Football", icon: "⚽", eventCount: 248 },
  { id: "basketball", name: "Basketball", icon: "🏀", eventCount: 87 },
  { id: "tennis", name: "Tennis", icon: "🎾", eventCount: 134 },
  { id: "american-football", name: "American Football", icon: "🏈", eventCount: 42 },
  { id: "baseball", name: "Baseball", icon: "⚾", eventCount: 61 },
  { id: "ice-hockey", name: "Ice Hockey", icon: "🏒", eventCount: 38 },
  { id: "volleyball", name: "Volleyball", icon: "🏐", eventCount: 29 },
  { id: "rugby", name: "Rugby", icon: "🏉", eventCount: 22 },
  { id: "cricket", name: "Cricket", icon: "🏏", eventCount: 18 },
  { id: "mma", name: "MMA", icon: "🥊", eventCount: 15 },
  { id: "esports", name: "Esports", icon: "🎮", eventCount: 56 },
  { id: "cycling", name: "Cycling", icon: "🚴", eventCount: 12 },
];

export const LIVE_MATCHES: Match[] = [
  {
    id: "live-1",
    homeTeam: { name: "Manchester City", shortName: "MCI" },
    awayTeam: { name: "Arsenal", shortName: "ARS" },
    league: "Premier League",
    sport: "football",
    odds: { home: 1.72, draw: 3.8, away: 4.5 },
    isLive: true,
    minute: 67,
    score: { home: 1, away: 1 },
    startTime: "Live",
  },
  {
    id: "live-2",
    homeTeam: { name: "Real Madrid", shortName: "RMA" },
    awayTeam: { name: "Barcelona", shortName: "BAR" },
    league: "La Liga",
    sport: "football",
    odds: { home: 2.1, draw: 3.4, away: 3.2 },
    isLive: true,
    minute: 34,
    score: { home: 0, away: 1 },
    startTime: "Live",
  },
  {
    id: "live-3",
    homeTeam: { name: "LA Lakers", shortName: "LAL" },
    awayTeam: { name: "Boston Celtics", shortName: "BOS" },
    league: "NBA",
    sport: "basketball",
    odds: { home: 1.95, away: 1.88 },
    isLive: true,
    minute: 3,
    score: { home: 78, away: 81 },
    startTime: "Live",
  },
  {
    id: "live-4",
    homeTeam: { name: "Bayern Munich", shortName: "BAY" },
    awayTeam: { name: "Borussia Dortmund", shortName: "BVB" },
    league: "Bundesliga",
    sport: "football",
    odds: { home: 1.55, draw: 4.2, away: 5.5 },
    isLive: true,
    minute: 82,
    score: { home: 3, away: 1 },
    startTime: "Live",
  },
  {
    id: "live-5",
    homeTeam: { name: "Djokovic N.", shortName: "DJO" },
    awayTeam: { name: "Alcaraz C.", shortName: "ALC" },
    league: "Australian Open",
    sport: "tennis",
    odds: { home: 1.65, away: 2.2 },
    isLive: true,
    startTime: "Live",
    score: { home: 1, away: 2 },
  },
  {
    id: "live-6",
    homeTeam: { name: "PSG", shortName: "PSG" },
    awayTeam: { name: "Marseille", shortName: "MAR" },
    league: "Ligue 1",
    sport: "football",
    odds: { home: 1.45, draw: 4.6, away: 6.8 },
    isLive: true,
    minute: 51,
    score: { home: 2, away: 0 },
    startTime: "Live",
  },
];

export const UPCOMING_MATCHES: Match[] = [
  {
    id: "up-1",
    homeTeam: { name: "Liverpool", shortName: "LIV" },
    awayTeam: { name: "Chelsea", shortName: "CHE" },
    league: "Premier League",
    sport: "football",
    odds: { home: 2.05, draw: 3.5, away: 3.4 },
    isLive: false,
    startTime: "Today 20:45",
    isFeatured: true,
    popularity: 98,
  },
  {
    id: "up-2",
    homeTeam: { name: "Atletico Madrid", shortName: "ATM" },
    awayTeam: { name: "Sevilla", shortName: "SEV" },
    league: "La Liga",
    sport: "football",
    odds: { home: 1.88, draw: 3.6, away: 3.9 },
    isLive: false,
    startTime: "Today 21:00",
    popularity: 75,
  },
  {
    id: "up-3",
    homeTeam: { name: "Golden State Warriors", shortName: "GSW" },
    awayTeam: { name: "Miami Heat", shortName: "MIA" },
    league: "NBA",
    sport: "basketball",
    odds: { home: 1.75, away: 2.05 },
    isLive: false,
    startTime: "Today 23:30",
    popularity: 82,
  },
  {
    id: "up-4",
    homeTeam: { name: "Inter Milan", shortName: "INT" },
    awayTeam: { name: "AC Milan", shortName: "MIL" },
    league: "Serie A",
    sport: "football",
    odds: { home: 2.25, draw: 3.3, away: 3.1 },
    isLive: false,
    startTime: "Tomorrow 20:45",
    isFeatured: true,
    popularity: 91,
  },
  {
    id: "up-5",
    homeTeam: { name: "Sporting CP", shortName: "SCP" },
    awayTeam: { name: "Benfica", shortName: "SLB" },
    league: "Primeira Liga",
    sport: "football",
    odds: { home: 2.4, draw: 3.2, away: 2.9 },
    isLive: false,
    startTime: "Tomorrow 21:00",
    popularity: 68,
  },
  {
    id: "up-6",
    homeTeam: { name: "New England Patriots", shortName: "NE" },
    awayTeam: { name: "Dallas Cowboys", shortName: "DAL" },
    league: "NFL",
    sport: "american-football",
    odds: { home: 1.9, away: 1.92 },
    isLive: false,
    startTime: "Sun 17:25",
    popularity: 88,
  },
  {
    id: "up-7",
    homeTeam: { name: "Flamengo", shortName: "FLA" },
    awayTeam: { name: "Palmeiras", shortName: "PAL" },
    league: "Brasileirão",
    sport: "football",
    odds: { home: 2.15, draw: 3.1, away: 3.5 },
    isLive: false,
    startTime: "Today 22:00",
    popularity: 72,
  },
  {
    id: "up-8",
    homeTeam: { name: "Juventus", shortName: "JUV" },
    awayTeam: { name: "Roma", shortName: "ROM" },
    league: "Serie A",
    sport: "football",
    odds: { home: 1.78, draw: 3.7, away: 4.2 },
    isLive: false,
    startTime: "Tomorrow 18:00",
    popularity: 65,
  },
  {
    id: "up-9",
    homeTeam: { name: "Nadal R.", shortName: "NAD" },
    awayTeam: { name: "Medvedev D.", shortName: "MED" },
    league: "Roland Garros",
    sport: "tennis",
    odds: { home: 1.45, away: 2.7 },
    isLive: false,
    startTime: "Tomorrow 14:00",
    popularity: 79,
  },
  {
    id: "up-10",
    homeTeam: { name: "Team Liquid", shortName: "TL" },
    awayTeam: { name: "Natus Vincere", shortName: "NAVI" },
    league: "ESL Pro League",
    sport: "esports",
    odds: { home: 2.3, away: 1.6 },
    isLive: false,
    startTime: "Today 19:00",
    popularity: 58,
  },
];

export const FEATURED_MATCHES: Match[] = [
  {
    id: "feat-1",
    homeTeam: { name: "Liverpool", shortName: "LIV" },
    awayTeam: { name: "Chelsea", shortName: "CHE" },
    league: "Premier League",
    sport: "football",
    odds: { home: 2.05, draw: 3.5, away: 3.4 },
    isLive: false,
    startTime: "Today 20:45",
    isFeatured: true,
  },
  {
    id: "feat-2",
    homeTeam: { name: "Inter Milan", shortName: "INT" },
    awayTeam: { name: "AC Milan", shortName: "MIL" },
    league: "Serie A - Derby della Madonnina",
    sport: "football",
    odds: { home: 2.25, draw: 3.3, away: 3.1 },
    isLive: false,
    startTime: "Tomorrow 20:45",
    isFeatured: true,
  },
  {
    id: "feat-3",
    homeTeam: { name: "Los Angeles Lakers", shortName: "LAL" },
    awayTeam: { name: "Boston Celtics", shortName: "BOS" },
    league: "NBA Finals - Game 7",
    sport: "basketball",
    odds: { home: 2.1, away: 1.72 },
    isLive: false,
    startTime: "Tonight 02:00",
    isFeatured: true,
  },
];

export type BetSelection = {
  matchId: string;
  matchName: string;
  market: string;
  selection: string;
  odds: number;
};
