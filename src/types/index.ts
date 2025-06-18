// Player Types
export enum Position {
  PG = 'Point Guard',
  SG = 'Shooting Guard',
  SF = 'Small Forward',
  PF = 'Power Forward',
  C = 'Center'
}

export enum Skill {
  SHOOTER = 'Shooter',
  DEFENDER = 'Defender',
  PLAYMAKER = 'Playmaker',
  REBOUNDER = 'Rebounder',
  FINISHER = 'Finisher',
  ENERGY = 'Energy Player',
  VERSATILE = 'Versatile'
}

export interface PerformanceStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position | Position[];
  minutes: {
    target: number;
    max: number;
    consecutive: number;
  };
  skills: Skill[];
  stats?: PerformanceStats;
}

// Rotation Types
export interface TimeSegment {
  startTime: number;
  endTime: number;
  onCourt: boolean;
}

export interface PlayerAssignment {
  playerId: string;
  segments: TimeSegment[];
}

export interface Period {
  id: string;
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface Rotation {
  id: string;
  gameId: string;
  name: string;
  periods: Period[];
  playerAssignments: PlayerAssignment[];
}

export interface Game {
  id: string;
  opponent: string;
  date: string;
  location: string;
  rotationId?: string;
}

// UI Types
export interface DraggableItem {
  id: string;
  type: 'player' | 'segment';
  content: Player | TimeSegment;
}

export interface SelectOption {
  value: string;
  label: string;
}

// Analytics Types
export interface LineupEffectiveness {
  players: string[];
  offensiveRating: number;
  defensiveRating: number;
  plusMinus: number;
}

export interface FatigueModel {
  playerId: string;
  timestamps: number[];
  fatigueValues: number[];
}

export interface MinutesDistribution {
  playerId: string;
  totalMinutes: number;
  minutesByPeriod: Record<string, number>;
}