import { Habit, Quest, Reward, PlayerStats } from './types';

export interface ElectronAPI {
    updateTray: (missions: string[]) => void;
    db: {
        load: () => Promise<{ player: PlayerStats; habits: Habit[]; quests: Quest[]; rewards: Reward[] }>;
        savePlayer: (player: PlayerStats) => void;
        saveHabits: (habits: Habit[]) => void;
        saveQuests: (quests: Quest[]) => void;
        saveRewards: (rewards: Reward[]) => void;
        updateInventory: (items: string[]) => void;
        updateEquipped: (equipped: PlayerStats['equipped']) => void;
        addHistory: (date: string, xp: number) => void;
    }
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
