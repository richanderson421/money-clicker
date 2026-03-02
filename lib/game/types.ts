export type Building = {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  owned: number;
  icon: string;
  blurb: string;
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  kind: 'click' | 'income' | 'building';
  multiplier: number;
  targetBuildingId?: string;
  icon: string;
};

export type Stats = {
  totalEarned: number;
  totalClicks: number;
  timePlayed: number;
  biggestOfflinePayout: number;
};

export type GameState = {
  version: number;
  cash: number;
  clickPower: number;
  buildings: Building[];
  upgrades: Upgrade[];
  stats: Stats;
  createdAt: number;
  lastSeen: number;
  updatedAt: number;
};

export type GameAction =
  | { type: 'CLICK'; now: number }
  | { type: 'BUY_BUILDING'; id: string; now: number }
  | { type: 'BUY_UPGRADE'; id: string; now: number }
  | { type: 'TICK'; seconds: number; now: number }
  | { type: 'APPLY_OFFLINE_EARNINGS'; secondsAway: number; now: number }
  | { type: 'IMPORT_STATE'; state: GameState; now: number }
  | { type: 'RESET'; now: number };
