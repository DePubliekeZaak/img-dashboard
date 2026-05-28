// stores/data.store.ts
import { atom } from "nanostores";

// Singleton across all bundles
if (!(window as any).__IMG_RAW_DATA$__) {
	(window as any).__IMG_RAW_DATA$__ = atom<Record<string, any[]>>({});
}
if (!(window as any).__IMG_IS_LOADING$__) {
	(window as any).__IMG_IS_LOADING$__ = atom<boolean>(false);
}

export const rawData$ = (window as any).__IMG_RAW_DATA$__;
export const isLoading$ = (window as any).__IMG_IS_LOADING$__;

export function setData(key: string, data: any[]) {
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
