'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  OFFLINE_CAP_SECONDS,
  applyAction,
  createInitialState,
  exactCurrency,
  exportSave,
  formatDuration,
  formatMoney,
  getBuildingCost,
  getCashPerSecond,
  getClickPower,
  importSave,
  loadState,
  saveGame,
  type GameState
} from '@/lib/game';
import { MoneyOrb } from './icons';

type FloatText = { id: number; text: string };

export function GameShell() {
  const [game, setGame] = useState<GameState>(() => createInitialState());
  const [saved, setSaved] = useState(true);
  const [offlineMessage, setOfflineMessage] = useState<string | null>(null);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [pressed, setPressed] = useState(false);
  const tickRef = useRef<number | null>(null);

  const cashPerSecond = useMemo(() => getCashPerSecond(game), [game]);
  const clickPower = useMemo(() => getClickPower(game), [game]);

  useEffect(() => {
    const now = Date.now();
    const loaded = loadState(now);
    const awaySeconds = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, Math.floor((now - loaded.lastSeen) / 1000)));
    let next = { ...loaded };

    if (awaySeconds > 0) {
      next = applyAction(loaded, { type: 'APPLY_OFFLINE_EARNINGS', secondsAway: awaySeconds, now });
      setOfflineMessage(`While you were away for ${formatDuration(awaySeconds)}, you earned ${formatMoney(getCashPerSecond(loaded) * awaySeconds)}.`);
    } else {
      next = { ...loaded, lastSeen: now, updatedAt: now };
    }

    setGame(next);
    saveGame(next);
    setSaved(true);
  }, []);

  useEffect(() => {
    tickRef.current = window.setInterval(() => {
      setGame((prev) => applyAction(prev, { type: 'TICK', seconds: 1, now: Date.now() }));
      setSaved(false);
    }, 1000);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const ok = saveGame({ ...game, lastSeen: Date.now(), updatedAt: Date.now() });
      setSaved(ok);
    }, 10000);
    return () => window.clearInterval(id);
  }, [game]);

  useEffect(() => {
    const persist = () => saveGame({ ...game, lastSeen: Date.now(), updatedAt: Date.now() });
    const onVis = () => {
      if (document.visibilityState === 'hidden') persist();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('beforeunload', persist);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('beforeunload', persist);
    };
  }, [game]);

  const clickMoney = () => {
    const now = Date.now();
    setPressed(true);
    setTimeout(() => setPressed(false), 120);
    setGame((prev) => applyAction(prev, { type: 'CLICK', now }));
    setSaved(false);
    setFloats((prev) => [...prev, { id: now, text: `+${formatMoney(clickPower)}` }]);
    setTimeout(() => {
      setFloats((prev) => prev.slice(1));
    }, 900);
  };

  const buyBuilding = (id: string) => {
    const next = applyAction(game, { type: 'BUY_BUILDING', id, now: Date.now() });
    setGame(next);
    saveGame(next);
    setSaved(true);
  };

  const buyUpgrade = (id: string) => {
    const next = applyAction(game, { type: 'BUY_UPGRADE', id, now: Date.now() });
    setGame(next);
    saveGame(next);
    setSaved(true);
  };

  const onExport = async () => {
    await navigator.clipboard.writeText(exportSave(game));
    setOfflineMessage('Save copied to clipboard.');
  };

  const onImport = () => {
    const text = window.prompt('Paste your save JSON:');
    if (!text) return;
    const imported = importSave(text);
    if (!imported) {
      setOfflineMessage('Invalid save data.');
      return;
    }
    const next = applyAction(game, { type: 'IMPORT_STATE', state: imported, now: Date.now() });
    setGame(next);
    saveGame(next);
    setSaved(true);
    setOfflineMessage('Save imported successfully.');
  };

  const onReset = () => {
    const confirmed = window.confirm('Reset all progress? This cannot be undone.');
    if (!confirmed) return;
    const next = applyAction(game, { type: 'RESET', now: Date.now() });
    setGame(next);
    saveGame(next);
    setSaved(true);
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-4 grid gap-2 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm md:grid-cols-4">
        <Stat label="Cash" value={formatMoney(game.cash)} exact={exactCurrency(game.cash)} />
        <Stat label="Cash/sec" value={formatMoney(cashPerSecond)} exact={exactCurrency(cashPerSecond)} />
        <Stat label="Click Power" value={formatMoney(clickPower)} exact={exactCurrency(clickPower)} />
        <Stat label="Total Earned" value={formatMoney(game.stats.totalEarned)} exact={exactCurrency(game.stats.totalEarned)} />
        <Stat label="Total Clicks" value={game.stats.totalClicks.toLocaleString()} />
        <Stat label="Time Played" value={formatDuration(game.stats.timePlayed)} />
        <Stat label="Biggest Offline" value={formatMoney(game.stats.biggestOfflinePayout)} exact={exactCurrency(game.stats.biggestOfflinePayout)} />
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <span className="text-white/70">Save Status</span>
          <span className={saved ? 'text-mint' : 'text-yellow-300'}>{saved ? 'Saved ✓' : 'Saving…'}</span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_300px]">
        <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <h1 className="mb-3 text-2xl font-bold">Money Clicker</h1>
          <div className="relative flex min-h-[280px] items-center justify-center rounded-2xl bg-gradient-to-b from-emerald-500/20 to-black/20">
            {floats.map((f) => (
              <span key={f.id} className="floating-plus">{f.text}</span>
            ))}
            <button
              onClick={clickMoney}
              className={`relative transition-transform ${pressed ? 'scale-95' : 'scale-100'} animate-bob`}
              aria-label="Tap for cash"
            >
              <MoneyOrb />
              <span className="absolute right-2 top-2 animate-sparkle text-xl">✨</span>
            </button>
          </div>
          <p className="mt-3 text-sm text-white/70">Tap the money orb to earn cash. Build your empire with passive income.</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <h2 className="mb-3 text-xl font-semibold">Shop</h2>
          <div className="space-y-2">
            {game.buildings.map((b) => {
              const cost = getBuildingCost(b);
              return (
                <button key={b.id} onClick={() => buyBuilding(b.id)} disabled={game.cash < cost} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{b.icon} {b.name} <span className="text-white/50">x{b.owned}</span></p>
                      <p className="text-xs text-white/60">{b.blurb} · +{formatMoney(b.baseIncome)}/sec each</p>
                    </div>
                    <p className="font-semibold">{formatMoney(cost)}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <h3 className="mb-2 mt-4 text-lg font-semibold">Upgrades</h3>
          <div className="space-y-2">
            {game.upgrades.map((u) => (
              <button key={u.id} onClick={() => buyUpgrade(u.id)} disabled={u.purchased || game.cash < u.cost} className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{u.icon} {u.name} {u.purchased && <span className="text-mint">(Owned)</span>}</p>
                    <p className="text-xs text-white/60">{u.description}</p>
                  </div>
                  <p className="font-semibold">{formatMoney(u.cost)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <h2 className="mb-3 text-xl font-semibold">Save Controls</h2>
          <div className="space-y-2">
            <button className="w-full rounded-xl bg-emerald-500 px-3 py-2 font-semibold text-black" onClick={onExport}>Export Save</button>
            <button className="w-full rounded-xl bg-emerald-300 px-3 py-2 font-semibold text-black" onClick={onImport}>Import Save</button>
            <button className="w-full rounded-xl bg-red-500 px-3 py-2 font-semibold" onClick={onReset}>Reset Game</button>
          </div>
        </section>
      </div>

      {offlineMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-5 text-center">
            <p className="text-lg">{offlineMessage}</p>
            <button onClick={() => setOfflineMessage(null)} className="mt-4 rounded-lg bg-mint px-4 py-2 font-semibold text-black">Nice!</button>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, exact }: { label: string; value: string; exact?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2" title={exact ? `$${exact}` : undefined}>
      <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
      <p className="text-lg font-bold text-mint">{value}</p>
      {exact && <p className="text-[11px] text-white/40">Exact: ${exact}</p>}
    </div>
  );
}
