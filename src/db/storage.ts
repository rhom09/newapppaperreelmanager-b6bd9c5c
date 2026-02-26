import type { AppData } from '../types';

const STORAGE_KEY = 'uvpack_paper_reel_data';

import { mockData } from './mockData';

const defaultData: AppData = mockData;

export function loadData(): AppData {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultData };
        const parsed = JSON.parse(raw) as AppData;
        if (!parsed.suppliers || parsed.suppliers.length === 0) {
            return { ...defaultData };
        }
        return parsed;
    } catch {
        return { ...defaultData };
    }
}

export function saveData(data: AppData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save data:', e);
    }
}
