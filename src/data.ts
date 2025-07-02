import type { Team, Game, GoalThreshold } from "./types";

export const MOCK_TEAMS: Team[] = [
  {
    id: "1",
    name: "Man Utd",
    logo: "https://1000logos.net/wp-content/uploads/2017/03/Manchester-United-Logo.png",
    players: [
        { id: 'p1', name: "Fernandes", scoreStats: "Scored in 2 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "5/2", cardedOdd: "4/1" },
        { id: 'p2', name: "Rashford", scoreStats: "Scored in 3 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "7/4", cardedOdd: "8/1" },
        { id: 'p3', name: "Garnacho", scoreStats: "Scored in 1 of last 5 games", cardStats: "2 yellows in last 5 games", goalscorerOdd: "3/1", cardedOdd: "3/1" },
    ],
  },
  {
    id: "2",
    name: "Chelsea",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/fhBITrIlbQxhVB6IjxUO6Q_96x96.png",
    players: [
        { id: 'p4', name: "Palmer", scoreStats: "Scored in 4 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "6/4", cardedOdd: "5/1" },
        { id: 'p5', name: "Sterling", scoreStats: "Scored in 1 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "2/1", cardedOdd: "4/1" },
        { id: 'p6', name: "Jackson", scoreStats: "Scored in 2 of last 5 games", cardStats: "4 yellows in last 5 games", goalscorerOdd: "7/4", cardedOdd: "2/1" },
    ],
  },
  {
    id: "3",
    name: "Liverpool",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/0iShHhASp5q1SL4JhtwJiw_96x96.png",
    players: [
        { id: 'p7', name: "Salah", scoreStats: "Scored in 5 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "1/1", cardedOdd: "10/1" },
        { id: 'p8', name: "Núñez", scoreStats: "Scored in 3 of last 5 games", cardStats: "3 yellows in last 5 games", goalscorerOdd: "6/5", cardedOdd: "3/1" },
        { id: 'p9', name: "Diaz", scoreStats: "Scored in 2 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "2/1", cardedOdd: "5/1" },
    ],
  },
  {
    id: "4",
    name: "Arsenal",
    logo: "https://ssl.gstatic.com/onebox/media/sports/logos/4us2nCgl6kgZc0t3hpW75Q_96x96.png",
    players: [
        { id: 'p10', name: "Saka", scoreStats: "Scored in 4 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "7/4", cardedOdd: "6/1" },
        { id: 'p11', name: "Ødegaard", scoreStats: "Scored in 2 of last 5 games", cardStats: "2 yellows in last 5 games", goalscorerOdd: "3/1", cardedOdd: "4/1" },
        { id: 'p12', name: "Martinelli", scoreStats: "Scored in 2 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "2/1", cardedOdd: "9/1" },
    ],
  },
  {
    id: "5",
    name: "Man City",
    logo: "https://1000logos.net/wp-content/uploads/2017/05/Manchester-City-Logo.png",
    players: [
        { id: 'p13', name: "Haaland", scoreStats: "Scored in 5 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "4/6", cardedOdd: "7/1" },
        { id: 'p14', name: "De Bruyne", scoreStats: "Scored in 2 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "3/1", cardedOdd: "8/1" },
        { id: 'p15', name: "Foden", scoreStats: "Scored in 3 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "2/1", cardedOdd: "6/1" },
    ],
  },
  {
    id: "6",
    name: "Spurs",
    logo: "https://1000logos.net/wp-content/uploads/2018/06/Tottenham-Hotspur-Logo.png",
    players: [
        { id: 'p16', name: "Son", scoreStats: "Scored in 4 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "2/1", cardedOdd: "10/1" },
        { id: 'p17', name: "Maddison", scoreStats: "Scored in 1 of last 5 games", cardStats: "3 yellows in last 5 games", goalscorerOdd: "4/1", cardedOdd: "3/1" },
        { id: 'p18', name: "Kulusevski", scoreStats: "Scored in 2 of last 5 games", cardStats: "2 yellows in last 5 games", goalscorerOdd: "3/1", cardedOdd: "4/1" },
    ],
  },
  {
    id: "7",
    name: "Real Madrid",
    logo: "https://1000logos.net/wp-content/uploads/2020/09/Real-Madrid-logo.png",
    players: [
        { id: 'p19', name: "Bellingham", scoreStats: "Scored in 4 of last 5 games", cardStats: "4 yellows in last 5 games", goalscorerOdd: "2/1", cardedOdd: "2/1" },
        { id: 'p20', name: "Vini Jr.", scoreStats: "Scored in 3 of last 5 games", cardStats: "3 yellows in last 5 games", goalscorerOdd: "7/4", cardedOdd: "3/1" },
        { id: 'p21', name: "Rodrygo", scoreStats: "Scored in 2 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "2/1", cardedOdd: "6/1" },
    ],
  },
  {
    id: "8",
    name: "Barcelona",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Barcelona-Logo.png",
    players: [
        { id: 'p22', name: "Lewandowski", scoreStats: "Scored in 4 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "6/4", cardedOdd: "7/1" },
        { id: 'p23', name: "Gündoğan", scoreStats: "Scored in 1 of last 5 games", cardStats: "2 yellows in last 5 games", goalscorerOdd: "4/1", cardedOdd: "4/1" },
        { id: 'p24', name: "Pedri", scoreStats: "Scored in 0 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "6/1", cardedOdd: "9/1" },
    ],
  },
  {
    id: "9",
    name: "Bayern",
    logo: "https://1000logos.net/wp-content/uploads/2018/05/Bayern-Munchen-Logo.png",
    players: [
        { id: 'p25', name: "Kane", scoreStats: "Scored in 5 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "4/7", cardedOdd: "8/1" },
        { id: 'p26', name: "Musiala", scoreStats: "Scored in 3 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "2/1", cardedOdd: "10/1" },
        { id: 'p27', name: "Kimmich", scoreStats: "Scored in 0 of last 5 games", cardStats: "3 yellows in last 5 games", goalscorerOdd: "7/1", cardedOdd: "3/1" },
    ],
  },
  {
    id: "10",
    name: "Dortmund",
    logo: "https://1000logos.net/wp-content/uploads/2017/08/BVB-Logo.png",
    players: [
        { id: 'p28', name: "Reus", scoreStats: "Scored in 2 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "3/1", cardedOdd: "5/1" },
        { id: 'p29', name: "Brandt", scoreStats: "Scored in 1 of last 5 games", cardStats: "2 yellows in last 5 games", goalscorerOdd: "4/1", cardedOdd: "4/1" },
        { id: 'p30', name: "Hummels", scoreStats: "Scored in 0 of last 5 games", cardStats: "4 yellows in last 5 games", goalscorerOdd: "10/1", cardedOdd: "2/1" },
    ],
  },
  {
    id: "11",
    name: "Juventus",
    logo: "https://1000logos.net/wp-content/uploads/2021/05/Juventus-logo.png",
    players: [
        { id: 'p31', name: "Vlahović", scoreStats: "Scored in 4 of last 5 games", cardStats: "2 yellows in last 5 games", goalscorerOdd: "6/4", cardedOdd: "4/1" },
        { id: 'p32', name: "Chiesa", scoreStats: "Scored in 2 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "3/1", cardedOdd: "5/1" },
        { id: 'p33', name: "Rabiot", scoreStats: "Scored in 1 of last 5 games", cardStats: "5 yellows in last 5 games", goalscorerOdd: "5/1", cardedOdd: "1/1" },
    ],
  },
  {
    id: "12",
    name: "AC Milan",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/AC-Milan-Logo.png",
    players: [
        { id: 'p34', name: "Leão", scoreStats: "Scored in 3 of last 5 games", cardStats: "3 yellows in last 5 games", goalscorerOdd: "2/1", cardedOdd: "3/1" },
        { id: 'p35', name: "Giroud", scoreStats: "Scored in 2 of last 5 games", cardStats: "1 yellow in last 5 games", goalscorerOdd: "5/2", cardedOdd: "6/1" },
        { id: 'p36', name: "Pulisic", scoreStats: "Scored in 1 of last 5 games", cardStats: "0 yellows in last 5 games", goalscorerOdd: "3/1", cardedOdd: "8/1" },
    ],
  },
];

export const MOCK_COMPETITIONS = {
  prem: "Premier League",
  fa_cup: "FA Cup",
  la_liga: "La Liga",
  serie_a: "Serie A",
  bundesliga: "Bundesliga",
};

export const MOCK_GAMES: Game[] = [
  { id: "g1", competition: "prem", home: MOCK_TEAMS[0], away: MOCK_TEAMS[5] },
  { id: "g2", competition: "prem", home: MOCK_TEAMS[2], away: MOCK_TEAMS[3] },
  { id: "g3", competition: "fa_cup", home: MOCK_TEAMS[4], away: MOCK_TEAMS[1] },
  {
    id: "g4",
    competition: "la_liga",
    home: MOCK_TEAMS[6],
    away: MOCK_TEAMS[7],
  },
  {
    id: "g5",
    competition: "serie_a",
    home: MOCK_TEAMS[10],
    away: MOCK_TEAMS[11],
  },
  {
    id: "g6",
    competition: "bundesliga",
    home: MOCK_TEAMS[8],
    away: MOCK_TEAMS[9],
  },
  { id: "g7", competition: "prem", home: MOCK_TEAMS[1], away: MOCK_TEAMS[2] },
  { id: "g8", competition: "prem", home: MOCK_TEAMS[3], away: MOCK_TEAMS[4] },
  {
    id: "g9",
    competition: "la_liga",
    home: MOCK_TEAMS[7],
    away: MOCK_TEAMS[9],
  },
  {
    id: "g10",
    competition: "serie_a",
    home: MOCK_TEAMS[11],
    away: MOCK_TEAMS[8],
  },
];

export const GOAL_THRESHOLDS: GoalThreshold[] = [
  { value: 1, multiplier: 1.5 },
  { value: 2, multiplier: 2.5 },
  { value: 3, multiplier: 4.0 },
  { value: 4, multiplier: 8.0 },
  { value: 5, multiplier: 15.0 },
];
export const ROW_PRIZE_MULTIPLIER = 5.0; 