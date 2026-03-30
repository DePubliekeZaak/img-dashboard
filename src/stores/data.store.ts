// stores/data.store.ts
import { atom, computed } from 'nanostores';

// Raw data from API
export const rawData$ = atom<Record<string, any[]>>({});

// Loading state
export const isLoading$ = atom<boolean>(false);

// Helpers
export function setData(key: string, data: any[]) {
  console.log(key, data)
  rawData$.set({ ...rawData$.get(), [key]: data });
}

export function getData(key: string): any[] | undefined {
  return rawData$.get()[key];
}

export function hasData(key: string): boolean {
  return rawData$.get()[key] !== undefined;
}

export function clearData() {
  rawData$.set({});
}

export function getAllData(): Record<string, any[]> {
  return rawData$.get();
}