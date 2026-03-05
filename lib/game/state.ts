import { ACHIEVEMENTS, BASE_FRENZY_CLICK_CHANCE, BUILDINGS, FRENZY_SECONDS, OFFLINE_CAP_SECONDS, REBIRTHS, SAVE_VERSION, UPGRADES } from './content';
import { getBuildingCost, getCashPerSecond, getClickPower, getFrenzyChance, getUpgradeCost, sanitizeNumber } from './math';
import { Achievement, GameAction, GameState } from './types';

export const SAVE_KEY = 'money-clicker-save-v2';

export function createInitialState(now = Date.now()): GameState {
  return {
    version: SAVE_VERSION,
    cash: 0,
    clickPower: 1,
    buildings: structuredClone(BUILDINGS),
    upgrades: structuredClone(UPGRADES),
    achievements: structuredClone(ACHIEVEMENTS),
    rebirthLevel: 0,
    frenzyUntil: 0,
    dynamicClickBonus: 0,
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

function mergeAchievements(current: Achievement[], now: number, predicate: (a: Achievement) => boolean): Achievement[] {
  return current.map((a) => (a.unlockedAt || !predicate(a) ? a : { ...a, unlockedAt: now }));
}

function unlockAchievements(state: GameState, now: number): GameState {
  const next = mergeAchievements(state.achievements, now, (a) => {
    if (a.id.startsWith('earn-')) {
      const target = Number(a.id.replace('earn-', ''));
      return state.stats.totalEarned >= target;
    }
    if (a.id === 'click-1k') return state.stats.totalClicks >= 1_000;
    if (a.id === 'click-10k') return state.stats.totalClicks >= 10_000;
    if (a.id === 'click-1m') return state.stats.totalClicks >= 1_000_000;
    if (a.id === 'cash-click-10m') return state.cash >= 10_000_000;
    if (a.id === 'cash-click-100m') return state.cash >= 100_000_000;
    if (a.id === 'cash-click-1b') return state.cash >= 1_000_000_000;
    if (a.id === 'cash-click-1t') return state.cash >= 1_000_000_000_000;
    if (a.id === 'absolute-zero') return state.rebirthLevel >= 4;
    return false;
  });
  return { ...state, achievements: next };
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
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : structuredClone(ACHIEVEMENTS),
      rebirthLevel: sanitizeNumber(parsed.rebirthLevel ?? 0),
      frenzyUntil: sanitizeNumber(parsed.frenzyUntil ?? 0),
      dynamicClickBonus: sanitizeNumber(parsed.dynamicClickBonus ?? 0),
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
      const frenzyChance = Math.max(BASE_FRENZY_CLICK_CHANCE, getFrenzyChance(state));
      const frenzyTriggered = action.now >= state.frenzyUntil && Math.random() < frenzyChance;
      const next: GameState = {
        ...state,
        frenzyUntil: frenzyTriggered ? action.now + FRENZY_SECONDS * 1000 : state.frenzyUntil,
        dynamicClickBonus: state.rebirthLevel >= 5 ? state.dynamicClickBonus + 1 : state.dynamicClickBonus,
        cash: sanitizeNumber(state.cash + gain),
        stats: {
          ...state.stats,
          totalClicks: state.stats.totalClicks + 1,
          totalEarned: sanitizeNumber(state.stats.totalEarned + gain)
        },
        updatedAt: action.now,
        lastSeen: action.now
      };
      return unlockAchievements(next, action.now);
    }
    case 'BUY_BUILDING': {
      const idx = state.buildings.findIndex((b) => b.id === action.id);
      if (idx === -1) return state;
      const target = state.buildings[idx];
      if ((target.unlockRebirthLevel ?? 0) > state.rebirthLevel) return state;
      const cost = getBuildingCost(target, state.upgrades, state.rebirthLevel);
      if (state.cash < cost) return state;
      const buildings = [...state.buildings];
      buildings[idx] = { ...target, owned: target.owned + 1 };
      return unlockAchievements(
        {
          ...state,
          buildings,
          cash: sanitizeNumber(state.cash - cost),
          updatedAt: action.now,
          lastSeen: action.now
        },
        action.now
      );
    }
    case 'BUY_UPGRADE': {
      const idx = state.upgrades.findIndex((u) => u.id === action.id);
      if (idx === -1) return state;
      const target = state.upgrades[idx];
      if ((target.unlockRebirthLevel ?? 0) > state.rebirthLevel) return state;
      if (target.maxLevel && target.level >= target.maxLevel) return state;
      const cost = getUpgradeCost(target);
      if (state.cash < cost) return state;
      const upgrades = [...state.upgrades];
      upgrades[idx] = { ...target, level: target.level + 1 };
      return {
        ...state,
        upgrades,
        cash: sanitizeNumber(state.cash - cost),
        updatedAt: action.now,
        lastSeen: action.now
      };
    }
    case 'REDEEM_REBIRTH': {
      const tier = REBIRTHS[state.rebirthLevel];
      if (!tier || state.cash < tier.cost) return state;
      return {
        ...createInitialState(action.now),
        rebirthLevel: state.rebirthLevel + 1,
        stats: state.stats,
        achievements: state.achievements,
        dynamicClickBonus: state.dynamicClickBonus,
        createdAt: state.createdAt,
        updatedAt: action.now,
        lastSeen: action.now
      };
    }
    case 'TICK': {
      const seconds = Math.max(0, action.seconds);
      if (seconds <= 0) return { ...state, updatedAt: action.now, lastSeen: action.now };
      const earned = getCashPerSecond(state) * seconds;
      const cash = sanitizeNumber(state.cash + earned);
      return unlockAchievements(
        {
          ...state,
          cash,
          stats: {
            ...state.stats,
            totalEarned: sanitizeNumber(state.stats.totalEarned + earned),
            timePlayed: state.stats.timePlayed + seconds
          },
          updatedAt: action.now,
          lastSeen: action.now
        },
        action.now
      );
    }
    case 'APPLY_OFFLINE_EARNINGS': {
      const safeAway = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, action.secondsAway));
      if (safeAway <= 0) return { ...state, lastSeen: action.now, updatedAt: action.now };
      const earned = getCashPerSecond(state) * safeAway;
      const payout = sanitizeNumber(earned);
      return unlockAchievements(
        {
          ...state,
          cash: sanitizeNumber(state.cash + payout),
          stats: {
            ...state.stats,
            totalEarned: sanitizeNumber(state.stats.totalEarned + payout),
            biggestOfflinePayout: Math.max(state.stats.biggestOfflinePayout, payout)
          },
          lastSeen: action.now,
          updatedAt: action.now
        },
        action.now
      );
    }
    case 'IMPORT_STATE':
      return { ...action.state, updatedAt: action.now, lastSeen: action.now };
    case 'RESET':
      return createInitialState(action.now);
    default:
      return state;
  }
}
