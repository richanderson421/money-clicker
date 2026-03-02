import { Building, Upgrade } from './types';

export const COST_SCALING = 1.15;
export const SAVE_VERSION = 1;
export const OFFLINE_CAP_SECONDS = 12 * 60 * 60;

export const BUILDINGS: Building[] = [
  { id: 'piggy', name: 'Piggy Bank', baseCost: 15, baseIncome: 0.2, owned: 0, icon: '🐷', blurb: 'Loose change vacuum' },
  { id: 'lemon', name: 'Lemon Stand', baseCost: 60, baseIncome: 1, owned: 0, icon: '🍋', blurb: 'Neighborhood classic' },
  { id: 'kiosk', name: 'Snack Kiosk', baseCost: 250, baseIncome: 4, owned: 0, icon: '🥨', blurb: 'Crunchy profits' },
  { id: 'arcade', name: 'Arcade Booth', baseCost: 1200, baseIncome: 12, owned: 0, icon: '🕹️', blurb: 'Retro cash machine' },
  { id: 'foodtruck', name: 'Food Truck', baseCost: 5500, baseIncome: 40, owned: 0, icon: '🚚', blurb: 'Rolling revenue' },
  { id: 'coffee', name: 'Coffee Bar', baseCost: 18000, baseIncome: 130, owned: 0, icon: '☕', blurb: 'Caffeine economy' },
  { id: 'shop', name: 'Corner Store', baseCost: 70000, baseIncome: 420, owned: 0, icon: '🏪', blurb: 'Open late, earns big' },
  { id: 'mall', name: 'Mini Mall', baseCost: 250000, baseIncome: 1450, owned: 0, icon: '🏬', blurb: 'Cashflow plaza' },
  { id: 'bank', name: 'Regional Bank', baseCost: 1000000, baseIncome: 5200, owned: 0, icon: '🏦', blurb: 'Interest empire' },
  { id: 'vault', name: 'Quantum Vault', baseCost: 6500000, baseIncome: 19000, owned: 0, icon: '🧰', blurb: 'Future-grade money gravity' }
];

export const UPGRADES: Upgrade[] = [
  { id: 'click-gloves', name: 'Golden Gloves', description: 'Click power x2', cost: 100, purchased: false, kind: 'click', multiplier: 2, icon: '🥊' },
  { id: 'tap-trainer', name: 'Tap Trainer', description: 'Click power x3', cost: 1200, purchased: false, kind: 'click', multiplier: 3, icon: '🎯' },
  { id: 'neon-sign', name: 'Neon Sign', description: 'All income x1.5', cost: 5000, purchased: false, kind: 'income', multiplier: 1.5, icon: '💡' },
  { id: 'franchise', name: 'Franchise Kit', description: 'All income x2', cost: 50000, purchased: false, kind: 'income', multiplier: 2, icon: '📈' },
  { id: 'bank-audit', name: 'Bank Automation', description: 'Regional Bank income x3', cost: 250000, purchased: false, kind: 'building', multiplier: 3, targetBuildingId: 'bank', icon: '🤖' },
  { id: 'vault-ai', name: 'Vault AI', description: 'Quantum Vault income x2', cost: 1500000, purchased: false, kind: 'building', multiplier: 2, targetBuildingId: 'vault', icon: '🧠' }
];
