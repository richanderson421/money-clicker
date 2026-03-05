import { Achievement, Building, RebirthTier, Upgrade } from './types';

export const COST_SCALING = 1.15;
export const SAVE_VERSION = 2;
export const OFFLINE_CAP_SECONDS = 12 * 60 * 60;
export const FRENZY_SECONDS = 60;
export const FRENZY_MULTIPLIER = 7;
export const BASE_FRENZY_CLICK_CHANCE = 0.02;

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
  { id: 'vault', name: 'Quantum Vault', baseCost: 6500000, baseIncome: 19000, owned: 0, icon: '🧰', blurb: 'Future-grade money gravity' },
  { id: 'zoo', name: 'Zoo', baseCost: 20000, baseIncome: 1200, owned: 0, icon: '🐼', blurb: 'Tourist-powered earnings' },
  { id: 'park', name: 'Amusement Park', baseCost: 80000, baseIncome: 3500, owned: 0, icon: '🎢', blurb: 'Ride tickets print cash' },
  { id: 'bitcoin', name: 'Bitcoin', baseCost: 4000000, baseIncome: 25100, owned: 0, icon: '🪙', blurb: 'Volatility with upside' },
  { id: 'diamond', name: 'Diamond Mine', baseCost: 30000000, baseIncome: 100000, owned: 0, icon: '💎', blurb: 'Shiny passive profit' },
  { id: 'portal', name: 'Money Portal', baseCost: 100000000, baseIncome: 1000000, owned: 0, icon: '🌌', blurb: 'Interdimensional payroll' },
  { id: 'atmo', name: 'Atmospheric Amplifier', baseCost: 350000000, baseIncome: 8000000, owned: 0, icon: '⛈️', blurb: 'Weather-controlled revenue' },
  { id: 'rocket', name: 'Rocket', baseCost: 550000000, baseIncome: 25600000, owned: 0, icon: '🚀', blurb: 'Orbital money loops' },
  { id: 'ubank', name: 'Universal Bank', baseCost: 1000000000, baseIncome: 70000000, owned: 0, icon: '🌌', blurb: 'Galactic finance layer' },
  { id: 'cyber', name: 'Cyber Empire', baseCost: 15000000000, baseIncome: 150000000, owned: 0, icon: '🦾', blurb: 'Automated megacorp earnings' },
  { id: 'voidbank', name: 'Voidbanking', baseCost: 40000000000, baseIncome: 500000000, owned: 0, icon: '⚫', blurb: 'Profits from nothingness' },
  { id: 'god', name: 'God', baseCost: 500000000000, baseIncome: 5000000000, owned: 0, icon: '☀️', blurb: 'Divine-level compounding' },
  { id: 'credit', name: 'Credit Card', baseCost: 20000000000, baseIncome: 30000000, owned: 0, icon: '💳', blurb: 'Unlocked by rebirth', unlockRebirthLevel: 1 }
];

export const UPGRADES: Upgrade[] = [
  { id: 'golden-gloves', name: 'Golden Gloves', description: 'Click power x1.2 per level', cost: 100, kind: 'click', multiplier: 1.2, icon: '🥊', level: 0, costScaling: 1.6 },
  { id: 'tap-trainer', name: 'Tap Trainer', description: 'Click power x1.4 per level', cost: 1200, kind: 'click', multiplier: 1.4, icon: '🎯', level: 0, costScaling: 1.7 },
  { id: 'neon-sign', name: 'Neon Sign', description: 'All income x1.2 per level', cost: 5000, kind: 'income', multiplier: 1.2, icon: '💡', level: 0, costScaling: 1.8 },
  { id: 'franchise', name: 'Franchise Kit', description: 'All income x1.4 per level', cost: 50000, kind: 'income', multiplier: 1.4, icon: '📈', level: 0, costScaling: 1.9 },
  { id: 'bigger-bucks', name: 'Bigger Bucks', description: 'Piggy Bank production x1.4', cost: 10000, kind: 'building', multiplier: 1.4, targetBuildingId: 'piggy', icon: '💸', level: 0, costScaling: 1.8 },
  { id: 'coffee-quality', name: 'High Quality Coffee', description: 'Coffee Bar production x1.2', cost: 20000, kind: 'building', multiplier: 1.2, targetBuildingId: 'coffee', icon: '🫘', level: 0, costScaling: 1.9 },
  { id: 'earlier-openings', name: 'Earlier Openings', description: 'Corner Store production x1.2', cost: 70000, kind: 'building', multiplier: 1.2, targetBuildingId: 'shop', icon: '🕰️', level: 0, costScaling: 2 },
  { id: 'swift-queue', name: 'Swift Queue', description: 'Amusement Park production x1.4', cost: 50000, kind: 'building', multiplier: 1.4, targetBuildingId: 'park', icon: '⚡', level: 0, costScaling: 2 },
  { id: 'glitchcoin', name: 'Glitchcoin', description: 'Bitcoin production x1.2', cost: 30000000000, kind: 'building', multiplier: 1.2, targetBuildingId: 'bitcoin', icon: '🪬', level: 0, costScaling: 2 },
  { id: 'money-monster', name: 'Money Monster', description: 'Money Portal production x1.2', cost: 50000000000000, kind: 'building', multiplier: 1.2, targetBuildingId: 'portal', icon: '👹', level: 0, costScaling: 2.1 },
  { id: 'duplicity', name: 'Duplicity', description: 'Click x5 and all income x3 per level', cost: 200000000000000, kind: 'click', multiplier: 5, icon: '💰', level: 0, costScaling: 2.2 },
  { id: 'lowered-stocks', name: 'Lowered Stocks', description: 'All building costs become cheaper', cost: 12000, kind: 'discount_all', multiplier: 0.8, icon: '📉', level: 0, costScaling: 2.3 },
  { id: 'lucky-day', name: 'Lucky Day', description: '+5% frenzy chance', cost: 100000000000000, kind: 'frenzy_chance', multiplier: 0.05, icon: '🍀', level: 0, costScaling: 2, unlockRebirthLevel: 2 },
  { id: 'asc-speed', name: 'Ascended Speed', description: 'All income x1.2', cost: 90000000000000, kind: 'income', multiplier: 1.2, icon: '🪽', level: 0, costScaling: 2, unlockRebirthLevel: 2 },
  { id: 'asc-strength', name: 'Ascended Strength', description: 'All income x1.5', cost: 70000000000000, kind: 'income', multiplier: 1.5, icon: '💪', level: 0, costScaling: 2, unlockRebirthLevel: 2 }
];

export const REBIRTHS: RebirthTier[] = [
  { id: 'sub-zero', name: '❄️ Sub Zero', cost: 100_000_000_000_000, description: 'Unlocks Credit Card building.' },
  { id: 'sub-zero-2', name: '🧊 Sub Zero 2', cost: 350_000_000_000_000, description: 'Global production x2.' },
  { id: 'sub-zero-3', name: '🥶 Sub Zero 3', cost: 600_000_000_000_000, description: 'All building costs are halved.' },
  { id: 'absolute-zero', name: '🌨️ Absolute Zero', cost: 800_000_000_000_000, description: 'Global production x5.' },
  { id: 'absolute-zero-2', name: '☃️ Absolute Zero 2', cost: 1_000_000_000_000_000, description: 'Every click permanently grows click power.' },
  { id: 'absolute-zero-3', name: '💠 Absolute Zero 3', cost: 3_000_000_000_000_000, description: 'Click power is also added to passive income.' }
];

const moneyMilestones = [1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24];
const moneyNames = ['Mint-a-thon', 'Billionaire', 'Trillionaire', 'Quadrillionaire', 'Quintillionaire', 'Sextillionaire', 'Septillionaire'];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'absolute-zero', name: 'Absolute Zero', description: 'Reach rebirth tier Absolute Zero.' },
  ...moneyMilestones.map((m, i) => ({ id: `earn-${m}`, name: moneyNames[i], description: `Earn ${m.toLocaleString()} total cash.` })),
  { id: 'click-1k', name: 'Clickapocalypse I', description: 'Click 1,000 times.' },
  { id: 'click-10k', name: 'Clickapocalypse II', description: 'Click 10,000 times.' },
  { id: 'click-1m', name: 'Clickapocalypse III', description: 'Click 1,000,000 times.' },
  { id: 'cash-click-10m', name: 'Heavy Finger', description: 'Reach $10,000,000 cash.' },
  { id: 'cash-click-100m', name: 'Mega Finger', description: 'Reach $100,000,000 cash.' },
  { id: 'cash-click-1b', name: 'Giga Finger', description: 'Reach $1,000,000,000 cash.' },
  { id: 'cash-click-1t', name: 'Tera Finger', description: 'Reach $1,000,000,000,000 cash.' }
];
