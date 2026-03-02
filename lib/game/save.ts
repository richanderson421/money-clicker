import { GameState } from './types';
import { SAVE_KEY, serializeState, validateState } from './state';

export function saveGame(state: GameState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(SAVE_KEY, serializeState(state));
    return true;
  } catch {
    return false;
  }
}

export function exportSave(state: GameState): string {
  return serializeState(state);
}

export function importSave(text: string): GameState | null {
  try {
    const parsed = JSON.parse(text);
    return validateState(parsed);
  } catch {
    return null;
  }
}
