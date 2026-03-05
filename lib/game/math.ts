import { COST_SCALING, FRENZY_MULTIPLIER } from './content';
import { Building, GameState, Upgrade } from './types';

export function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  return value;
}

export function formatMoney(value: number): string {
  const n = sanitizeNumber(value);
  if (n < 1000) return `$${n.toFixed(n >= 100 ? 0 : 1)}`;
  const suffixes = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp'];
  let unit = -1;
  let scaled = n;
  while (scaled >= 1000 && unit < suffixes.length - 1) {
    scaled /= 1000;
    unit += 1;
  }
  return `$${scaled.toFixed(scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2)}${suffixes[unit]}`;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function exactCurrency(value: number): string {
  return sanitizeNumber(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function powered(multiplier: number, level: number): number {
  return Math.pow(multiplier, Math.max(0, level));
}

export function getUpgradeCost(upgrade: Upgrade): number {
  return sanitizeNumber(upgrade.cost * Math.pow(upgrade.costScaling ?? 2, upgrade.level));
}

export function getGlobalDiscountMultiplier(upgrades: Upgrade[], rebirthLevel: number): number {
  const fromUpgrades = upgrades
    .filter((u) => u.kind === 'discount_all' && u.level > 0)
    .reduce((acc, u) => acc * powered(u.multiplier, u.level), 1);
  const rebirthDiscount = rebirthLevel >= 3 ? 0.5 : 1;
  return fromUpgrades * rebirthDiscount;
}

export function getBuildingCost(building: Building, upgrades: Upgrade[] = [], rebirthLevel = 0): number {
  const base = building.baseCost * Math.pow(COST_SCALING, building.owned);
  return sanitizeNumber(base * getGlobalDiscountMultiplier(upgrades, rebirthLevel));
}

function buildingIncome(building: Building, upgrades: Upgrade[]): number {
  const targetMult = upgrades
    .filter((u) => u.level > 0 && u.kind === 'building' && u.targetBuildingId === building.id)
    .reduce((acc, u) => acc * powered(u.multiplier, u.level), 1);
  return building.baseIncome * building.owned * targetMult;
}

function rebirthProductionMultiplier(level: number): number {
  let m = 1;
  if (level >= 2) m *= 2;
  if (level >= 4) m *= 5;
  return m;
}

export function getIncomeMultiplier(upgrades: Upgrade[]): number {
  return upgrades
    .filter((u) => u.level > 0 && u.kind === 'income')
    .reduce((acc, u) => acc * powered(u.multiplier, u.level), 1);
}

export function getFrenzyChance(state: GameState): number {
  return state.upgrades
    .filter((u) => u.level > 0 && u.kind === 'frenzy_chance')
    .reduce((acc, u) => acc + u.multiplier * u.level, 0) + 0.02;
}

export function getClickPower(state: GameState): number {
  const clickMult = state.upgrades
    .filter((u) => u.level > 0 && u.kind === 'click')
    .reduce((acc, u) => {
      if (u.id === 'duplicity') return acc * Math.pow(5, u.level);
      return acc * powered(u.multiplier, u.level);
    }, 1);

  const frenzyMult = state.frenzyUntil > state.updatedAt ? FRENZY_MULTIPLIER : 1;
  return sanitizeNumber((state.clickPower + state.dynamicClickBonus) * clickMult * rebirthProductionMultiplier(state.rebirthLevel) * frenzyMult);
}

export function getCashPerSecond(state: GameState): number {
  const totalBase = state.buildings.reduce((sum, building) => sum + buildingIncome(building, state.upgrades), 0);
  const incomeMult = getIncomeMultiplier(state.upgrades);
  const duplicityIncome = state.upgrades.find((u) => u.id === 'duplicity')?.level ?? 0;
  const duplicityMult = Math.pow(3, duplicityIncome);
  const rebirthMult = rebirthProductionMultiplier(state.rebirthLevel);
  const splitSelf = state.rebirthLevel >= 6 ? (state.clickPower + state.dynamicClickBonus) : 0;
  const frenzyMult = state.frenzyUntil > state.updatedAt ? FRENZY_MULTIPLIER : 1;
  const income = (totalBase * incomeMult * duplicityMult * rebirthMult + splitSelf) * frenzyMult;
  return sanitizeNumber(income);
}
