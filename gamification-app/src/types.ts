export type QuestType = 'BOSS' | 'SECONDARY' | 'BONUS';
export type ItemType = 'HEAD' | 'BODY' | 'LEGS' | 'BOOTS' | 'WEAPON' | 'SHIELD' | 'AURA' | 'MOLDURA';

export interface Habit {
    id: string;
    title: string;
    xpReward: number;
    xpPenalty: number;
    streak: number;
    history: string[]; // ISO date strings
}

export interface Quest {
    id: string;
    title: string;
    type: QuestType;
    rewardXP: number;
    rewardCoins: number;
    completed: boolean;
}

export interface Reward {
    id: string;
    title: string;
    cost: number;
}

export interface ShopItem {
    id: string;
    name: string;
    type: ItemType;
    cost: number;
    icon: string; // Lucide icon name or identifier
    description?: string;
}

export interface PlayerStats {
    name: string;
    level: number;
    currentXP: number;
    maxXP: number;
    coins: number;
    totalXP: number;
    history: { date: string; xp: number }[];

    // New Fields for V2
    inventory: string[]; // List of owned ShopItem IDs
    equipped: {
        HEAD?: string;
        BODY?: string;
        LEGS?: string;
        BOOTS?: string;
        WEAPON?: string;
        SHIELD?: string;
        AURA?: string;
        MOLDURA?: string;
    };
    // New field for avatar image (Base64 string)
    avatar?: string;
}

export interface GameState {
    player: PlayerStats;
    habits: Habit[];
    quests: Quest[];
    rewards: Reward[];
    shopItems: ShopItem[]; // Available items in shop
}

export interface GameContextType extends GameState {
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'history'>) => void;
    removeHabit: (id: string) => void;
    performHabit: (id: string, positive: boolean) => void;

    addQuest: (quest: Omit<Quest, 'id' | 'completed'>) => void;
    toggleQuest: (id: string) => void;
    removeQuest: (id: string) => void;

    addReward: (reward: Omit<Reward, 'id'>) => void;
    buyReward: (id: string) => void;
    removeReward: (id: string) => void;

    // New V2 Methods
    buyItem: (itemId: string) => void;
    equipItem: (itemId: string) => void;

    updatePlayerName: (name: string) => void;
    updatePlayerAvatar: (avatar: string) => void;
    importSave: (jsonData: string) => void;
    resetGame: () => void;

    resetDailyQuests: () => void;
}
