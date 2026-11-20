import type { Connection } from '../provider/types';

const KEY = 'multi.connections.v1';
const ACTIVE = 'multi.active.v1';
const SETTINGS = 'multi.settings.v1';

export interface Settings {
  attendantId: string; // what goes in lead_assignedAttendant_id
  attendantName: string;
  signMessages: boolean;
  sound: boolean;
  botPauseHours: number;
}

export const defaultSettings: Settings = {
  attendantId: '',
  attendantName: '',
  signMessages: false,
  sound: true,
  botPauseHours: 24,
};

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadConnections(): Connection[] {
  return read<Connection[]>(KEY, []);
}

export function saveConnections(list: Connection[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function loadActiveId(): string {
  return localStorage.getItem(ACTIVE) || '';
}

export function saveActiveId(id: string) {
  if (id) localStorage.setItem(ACTIVE, id);
  else localStorage.removeItem(ACTIVE);
}

export function loadSettings(): Settings {
  return { ...defaultSettings, ...read<Partial<Settings>>(SETTINGS, {}) };
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS, JSON.stringify(s));
}
