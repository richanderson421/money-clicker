import { BUILDINGS, OFFLINE_CAP_SECONDS, SAVE_VERSION, UPGRADES } from './content';
import { getBuildingCost, getCashPerSecond, getClickPower, sanitizeNumber } from './math';
import { GameAction, GameState } from './types';

export const SAVE_KEY = 'money-clicker-save-v1';

export function createInitialState(now = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    cash: 0,
    clickPower: 1,
    buildings: structuredClone(BUILDINGS),
    upgrades: structuredClone(UPGRADES),
    stats: {
      totalEarned: 0,
      totalClicks: 0,
      timePlayed: 0,
      biggestOfflinePayout: 0
    },
    createdAt: now,
    lastSeen: now,
    updatedAt: now
  };
}

export function validateState(maybe: unknown): GameState | null {
  try {
    const parsed = maybe as GameState;
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.version !== SAVE_VERSION) return null;
    if (!Array.isArray(parsed.buildings) || !Array.isArray(parsed.upgrades)) return null;
    if (typeof parsed.cash !== 'number' || typeof parsed.lastSeen !== 'number') return null;
    return {
      ...parsed,
      cash: sanitizeNumber(parsed.cash),
      clickPower: sanitizeNumber(parsed.clickPower),
      updatedAt: sanitizeNumber(parsed.updatedAt),
      lastSeen: sanitizeNumber(parsed.lastSeen),
      stats: {
        totalEarned: sanitizeNumber(parsed.stats?.totalEarned ?? 0),
        totalClicks: sanitizeNumber(parsed.stats?.totalClicks ?? 0),
        timePlayed: sanitizeNumber(parsed.stats?.timePlayed ?? 0),
        biggestOfflinePayout: sanitizeNumber(parsed.stats?.biggestOfflinePayout ?? 0)
      }
    };
  } catch {
    return null;
  }
}

export function loadState(now = Date.now()): GameState {
  if (typeof window === 'undefined') return createInitialState(now);
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return createInitialState(now);

  try {
    const parsed = JSON.parse(raw);
    const validated = validateState(parsed);
    if (!validated) return createInitialState(now);
    return validated;
  } catch {
    return createInitialState(now);
  }
}

export function serializeState(state: GameState): string {
  return JSON.stringify(state);
}

export function applyAction(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CLICK': {
      const gain = getClickPower(state);
      const cash = sanitizeNumber(state.cash + gain);
      return {
        ...state,
        cash,
        stats: {
          ...state.stats,
          totalClicks: state.stats.totalClicks + 1,
          totalEarned: sanitizeNumber(state.stats.totalEarned + gain)
        },
        updatedAt: action.now,
        lastSeen: action.now
      };
    }
    case 'BUY_BUILDING': {
      const idx = state.buildings.findIndex((b) => b.id === action.id);
      if (idx === -1) return state;
      const target = state.buildings[idx];
      const cost = getBuildingCost(target);
      if (state.cash < cost) return state;
      const buildings = [...state.buildings];
      buildings[idx] = { ...target, owned: target.owned + 1 };
      return {
        ...state,
        buildings,
        cash: sanitizeNumber(state.cash - cost),
        updatedAt: action.now,
        lastSeen: action.now
      };
    }
    case 'BUY_UPGRADE': {
      const idx = state.upgrades.findIndex((u) => u.id === action.id);
      if (idx === -1) return state;
      const target = state.upgrades[idx];
      if (target.purchased || state.cash < target.cost) return state;
      const upgrades = [...state.upgrades];
      upgrades[idx] = { ...target, purchased: true };
      return {
        ...state,
        upgrades,
        cash: sanitizeNumber(state.cash - target.cost),
        updatedAt: action.now,
        lastSeen: action.now
      };
    }
    case 'TICK': {
      const seconds = Math.max(0, action.seconds);
      if (seconds <= 0) return { ...state, updatedAt: action.now, lastSeen: action.now };
      const earned = getCashPerSecond(state) * seconds;
      const cash = sanitizeNumber(state.cash + earned);
      return {
        ...state,
        cash,
        stats: {
          ...state.stats,
          totalEarned: sanitizeNumber(state.stats.totalEarned + earned),
          timePlayed: state.stats.timePlayed + seconds
        },
        updatedAt: action.now,
        lastSeen: action.now
      };
    }
    case 'APPLY_OFFLINE_EARNINGS': {
      const safeAway = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, action.secondsAway));
      if (safeAway <= 0) return { ...state, lastSeen: action.now, updatedAt: action.now };
      const earned = getCashPerSecond(state) * safeAway;
      const payout = sanitizeNumber(earned);
      return {
        ...state,
        cash: sanitizeNumber(state.cash + payout),
        stats: {
          ...state.stats,
          totalEarned: sanitizeNumber(state.stats.totalEarned + payout),
          biggestOfflinePayout: Math.max(state.stats.biggestOfflinePayout, payout)
        },
        lastSeen: action.now,
        updatedAt: action.now
      };
    }
    case 'IMPORT_STATE':
      return { ...action.state, updatedAt: action.now, lastSeen: action.now };
    case 'RESET':
      return createInitialState(action.now);
    default:
      return state;
  }
}
