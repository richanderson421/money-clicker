export type Building = {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number;
  owned: number;
  icon: string;
  blurb: string;
  unlockRebirthLevel?: number;
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  kind: 'click' | 'income' | 'building' | 'discount_all' | 'frenzy_chance';
  multiplier: number;
  targetBuildingId?: string;
  icon: string;
  level: number;
  maxLevel?: number;
  costScaling?: number;
  unlockRebirthLevel?: number;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlockedAt?: number;
};

export type RebirthTier = {
  id: string;
  name: string;
  cost: number;
  description: string;
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
  achievements: Achievement[];
  rebirthLevel: number;
  frenzyUntil: number;
  dynamicClickBonus: number;
  stats: Stats;
  createdAt: number;
  lastSeen: number;
  updatedAt: number;
};

export type GameAction =
  | { type: 'CLICK'; now: number }
  | { type: 'BUY_BUILDING'; id: string; now: number }
  | { type: 'BUY_UPGRADE'; id: string; now: number }
  | { type: 'REDEEM_REBIRTH'; now: number }
  | { type: 'TICK'; seconds: number; now: number }
  | { type: 'APPLY_OFFLINE_EARNINGS'; secondsAway: number; now: number }
  | { type: 'IMPORT_STATE'; state: GameState; now: number }
  | { type: 'RESET'; now: number };
