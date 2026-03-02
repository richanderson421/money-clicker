import { COST_SCALING } from './content';
import { Building, GameState, Upgrade } from './types';

export function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  return value;
}

export function formatMoney(value: number): string {
  const n = sanitizeNumber(value);
  if (n < 1000) return `$${n.toFixed(n >= 100 ? 0 : 1)}`;
  const suffixes = ['K', 'M', 'B', 'T', 'Qa', 'Qi'];
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

export function getBuildingCost(building: Building): number {
  return sanitizeNumber(building.baseCost * Math.pow(COST_SCALING, building.owned));
}

function buildingIncome(building: Building, upgrades: Upgrade[]): number {
  const targetMult = upgrades
    .filter((u) => u.purchased && u.kind === 'building' && u.targetBuildingId === building.id)
    .reduce((acc, u) => acc * u.multiplier, 1);
  return building.baseIncome * building.owned * targetMult;
}

export function getIncomeMultiplier(upgrades: Upgrade[]): number {
  return upgrades.filter((u) => u.purchased && u.kind === 'income').reduce((acc, u) => acc * u.multiplier, 1);
}

export function getClickPower(state: GameState): number {
  const clickMult = state.upgrades
    .filter((u) => u.purchased && u.kind === 'click')
    .reduce((acc, u) => acc * u.multiplier, 1);
  return sanitizeNumber(state.clickPower * clickMult);
}

export function getCashPerSecond(state: GameState): number {
  const totalBase = state.buildings.reduce((sum, building) => sum + buildingIncome(building, state.upgrades), 0);
  const income = totalBase * getIncomeMultiplier(state.upgrades);
  return sanitizeNumber(income);
}
