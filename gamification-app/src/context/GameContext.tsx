import React, { createContext, useContext, useEffect, useState } from 'react';
import { SHOP_ITEMS } from '../data/items';
import vegetaAvatar from '../assets/vegeta.ico';
import type { GameContextType, Habit, PlayerStats, Quest, Reward } from '../types';

// Cria o Contexto
const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYER: PlayerStats = {
    name: "EGO User",
    level: 1,
    currentXP: 0,
    maxXP: 10, // Nível 1 -> 2 = 10 XP (V2 Logic)
    coins: 0,
    totalXP: 0,
    history: [],
    inventory: [], // [V2] Inventário vazio inicial
    equipped: {},  // [V2] Nada equipado
    avatar: vegetaAvatar, // [EGO] Vegeta as default
};

/**
 * GameProvider (V2 Updated)
 * Gerencia estado global incluindo Shop, Inventário e Avatar.
 */
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<PlayerStats>(INITIAL_PLAYER);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Carregar do Banco de Dados (Electron)
    useEffect(() => {
        const load = async () => {
            try {

                if (window.electronAPI) {
                    const data = await window.electronAPI.db.load();
                    if (data) {
                        setPlayer({ ...INITIAL_PLAYER, ...data.player });
                        setHabits(data.habits || []);
                        setQuests(data.quests || []);
                        setRewards(data.rewards || []);
                    }
                } else {
                    // Fallback para Web (apenas se rodar fora do Electron)
                    const savedData = localStorage.getItem('gamification-data');
                    if (savedData) {
                        const parsed = JSON.parse(savedData);
                        setPlayer({ ...INITIAL_PLAYER, ...parsed.player });
                        setHabits(parsed.habits || []);
                        setQuests(parsed.quests || []);
                        setRewards(parsed.rewards || []);
                    }
                }
            } catch (e) {
                console.error("Erro ao carregar do DB", e);
            } finally {
                setLoaded(true);
            }
        };
        load();
    }, []);

    // Salvar estado (Granular)
    useEffect(() => {
        if (!loaded) return;
        if (window.electronAPI) {
            window.electronAPI.db.savePlayer(player);
        }
    }, [player, loaded]);

    useEffect(() => {
        if (!loaded) return;
        if (window.electronAPI) window.electronAPI.db.saveHabits(habits);
    }, [habits, loaded]);

    useEffect(() => {
        if (!loaded) return;
        if (window.electronAPI) window.electronAPI.db.saveQuests(quests);
    }, [quests, loaded]);

    useEffect(() => {
        if (!loaded) return;
        if (window.electronAPI) window.electronAPI.db.saveRewards(rewards);
    }, [rewards, loaded]);

    // Update Tray Missions (Dynamic Menu)
    useEffect(() => {
        if (window.electronAPI) {
            const activeMissions = quests
                .filter(q => !q.completed)
                .map(q => q.title);
            window.electronAPI.updateTray(activeMissions);
        }
    }, [quests]);

    /**
     * Lógica de Nível V2
     * Hard Cap no nível 10 e escala linear agressiva (Nível * 10)
     */
    const addXP = (amount: number) => {
        setPlayer(prev => {
            let { level, currentXP, totalXP, history } = prev;

            // 1. Apply raw amount
            currentXP += amount;
            totalXP += Math.max(0, amount); // Only gains add to total tracked

            // 2. Logic: Level UP (Infinite Scaling)
            // Difficulty: Level * 10
            let xpToNextLevel = level * 10;

            while (currentXP >= xpToNextLevel) {
                currentXP -= xpToNextLevel;
                level++;
                xpToNextLevel = level * 10; // Recalculate for next tier
            }

            // 3. Logic: Level DOWN
            while (currentXP < 0 && level > 1) {
                level--;
                const prevLevelCap = level * 10;
                currentXP += prevLevelCap;
                xpToNextLevel = prevLevelCap; // Update current requirement
            }

            // 4. Hard Cap (Flooring at Lvl 1)
            if (level === 1 && currentXP < 0) {
                currentXP = 0;
            }

            // 5. Update MaxXP for UI
            const newMax = level * 10;

            // Histórico (Gráfico)
            const today = new Date().toISOString().split('T')[0];

            // Salvar no Banco (Historico Persistente)
            if (window.electronAPI) {
                window.electronAPI.db.addHistory(today, amount);
            }

            const safeHistory = (Array.isArray(history) ? history : []).filter(h => h && h.date);
            const historyEntryIndex = safeHistory.findIndex(h => h.date === today);

            // Create a NEW array copy to avoid mutation
            let newHistory = [...safeHistory];

            if (historyEntryIndex >= 0) {
                // Ensure the entry exists before modifying
                const entry = { ...newHistory[historyEntryIndex] };
                entry.xp = (entry.xp || 0) + amount;
                newHistory[historyEntryIndex] = entry;
            } else {
                newHistory.push({ date: today, xp: amount });
            }
            // Keep last 7 days
            if (newHistory.length > 7) newHistory = newHistory.slice(-7);

            return {
                ...prev,
                level,
                currentXP,
                maxXP: newMax,
                totalXP,
                history: newHistory,
            };
        });
    };

    const addCoins = (amount: number) => {
        setPlayer(prev => ({ ...prev, coins: prev.coins + amount }));
    };

    // --- Habits ---
    const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'history'>) => {
        setHabits(prev => [...prev, { ...habit, id: crypto.randomUUID(), streak: 0, history: [] }]);
    };
    const removeHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));
    const performHabit = (id: string, positive: boolean) => {
        const habit = habits.find(h => h.id === id);
        if (habit) {
            if (positive) {
                addXP(habit.xpReward);
                addCoins(1);
            } else {
                addXP(-habit.xpPenalty);
            }
        }
    };

    // --- Quests ---
    const addQuest = (quest: Omit<Quest, 'id' | 'completed'>) => {
        setQuests(prev => [...prev, { ...quest, id: crypto.randomUUID(), completed: false }]);
    };
    const toggleQuest = (id: string) => {
        setQuests(prev => prev.map(q => {
            if (q.id === id) {
                if (!q.completed) { addXP(q.rewardXP); addCoins(q.rewardCoins); }
                else { addXP(-q.rewardXP); addCoins(-q.rewardCoins); }
                return { ...q, completed: !q.completed };
            }
            return q;
        }));
    };
    const removeQuest = (id: string) => setQuests(prev => prev.filter(q => q.id !== id));

    // --- Rewards ---
    const addReward = (reward: Omit<Reward, 'id'>) => {
        setRewards(prev => [...prev, { ...reward, id: crypto.randomUUID() }]);
    };
    const buyReward = (id: string) => {
        const reward = rewards.find(r => r.id === id);
        if (reward && player.coins >= reward.cost) {
            setPlayer(prev => ({ ...prev, coins: prev.coins - reward.cost }));
        }
    };
    const removeReward = (id: string) => setRewards(prev => prev.filter(r => r.id !== id));
    const resetDailyQuests = () => { };

    // --- V2 Shop Logic (Loja de Evolução) ---

    // Compra item cosmético
    const buyItem = (itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        if (player.inventory.includes(itemId)) return; // Já possui

        if (player.coins >= item.cost) {
            setPlayer(prev => ({
                ...prev,
                coins: prev.coins - item.cost,
                inventory: [...prev.inventory, itemId]
            }));
        }
    };

    // Equipa item no Avatar
    const equipItem = (itemId: string) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        // Só equipa se tiver no inventário
        if (!item || !player.inventory.includes(itemId)) return;

        setPlayer(prev => ({
            ...prev,
            equipped: {
                ...prev.equipped,
                [item.type]: itemId // Define o item para o slot específico (HEAD, BODY...)
            }
        }));
    };

    // --- Settings Logic (V3) ---
    const updatePlayerName = (name: string) => {
        setPlayer(prev => ({ ...prev, name }));
    };

    // Update avatar image (Base64 string)
    const updatePlayerAvatar = (avatar: string) => {
        setPlayer(prev => ({ ...prev, avatar }));
    };
    const resetGame = () => {
        setPlayer(INITIAL_PLAYER);
        setHabits([]);
        setQuests([]);
        setRewards([]);
        localStorage.removeItem('gamification-data');
    };

    const importSave = (jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);
            if (parsed.player && parsed.habits) {
                // Validação básica
                setPlayer({ ...INITIAL_PLAYER, ...parsed.player });
                setHabits(parsed.habits || []);
                setQuests(parsed.quests || []);
                setRewards(parsed.rewards || []);
            } else {
                alert("Invalid Save File!");
            }
        } catch (e) {
            console.error("Import Failed", e);
            alert("Failed to parse save file.");
        }
    };

    return (
        <GameContext.Provider value={{
            player, habits, quests, rewards,
            shopItems: SHOP_ITEMS,
            addHabit, removeHabit, performHabit,
            addQuest, toggleQuest, removeQuest,
            addReward, buyReward, removeReward,
            resetDailyQuests,
            buyItem, equipItem,
            updatePlayerName, updatePlayerAvatar, resetGame, importSave // [V3] New Exports
        }}>
            {children}
        </GameContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
