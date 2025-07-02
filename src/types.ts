export interface Player {
  id: string;
  name: string;
  scoreStats: string;
  cardStats: string;
  goalscorerOdd: string;
  cardedOdd: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  players: Player[];
}

export interface Game {
  id: string;
  competition: string;
  home: Team;
  away: Team;
}

export interface Score {
  home: number;
  away: number;
}

export type EventType = "GOAL" | "CHANCE" | "SAVE";

export interface LiveEvent {
  id: number;
  type: EventType;
  text: string;
  game: string;
  minute: number;
}

export type CelebrationType = "GOAL" | "JACKPOT" | "ROW_WIN" | "COLUMN_WIN" | "BET_WIN";

export interface CelebrationState {
  type: CelebrationType | string;
  text?: string;
  amount?: number;
}

export interface CompletedLines {
  rows: number[];
  cols: number[];
}

export interface GoalThreshold {
  value: number;
  multiplier: number;
}

export interface Winnings {
  id: string;
  amount: number;
} 