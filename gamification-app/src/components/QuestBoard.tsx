import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { QuestType } from '../types';
import { Shield, Sword, Star, CheckSquare, Square, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const QuestBoard: React.FC = () => {
    const { quests, addQuest, toggleQuest, removeQuest } = useGame();
    const [newQuest, setNewQuest] = useState('');
    const [questType, setQuestType] = useState<QuestType>('SECONDARY');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newQuest.trim()) return;

        let rewardXP = 10;
        let rewardCoins = 20;

        if (questType === 'BOSS') { rewardXP = 30; rewardCoins = 50; }
        if (questType === 'BONUS') { rewardXP = 20; rewardCoins = 10; }

        addQuest({
            title: newQuest,
            type: questType,
            rewardXP,
            rewardCoins
        });
        setNewQuest('');
    };

    // Define estilos (cores de fundo/borda) baseado no tipo da missão
    const getStyle = (type: QuestType) => {
        switch (type) {
            case 'BOSS': return 'border-red-500/50 bg-red-950/20'; // Vermelho para Boss
            case 'SECONDARY': return 'border-blue-500/50 bg-blue-950/20'; // Azul para Principal
            case 'BONUS': return 'border-green-500/50 bg-green-950/20'; // Verde para Side
        }
    };

    // Retorna o ícone correspondente ao tipo
    const getIcon = (type: QuestType) => {
        switch (type) {
            case 'BOSS': return <Shield className="w-5 h-5 text-red-500" />;
            case 'SECONDARY': return <Sword className="w-5 h-5 text-blue-500" />;
            case 'BONUS': return <Star className="w-5 h-5 text-green-500" />;
        }
    };

    const sortedQuests = React.useMemo(() => {
        return [...quests].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    }, [quests]);

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1 md:col-span-2">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sword className="text-primary" />
                Quest Board
            </h2>

            {/* ... form ... */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newQuest}
                    onChange={(e) => setNewQuest(e.target.value)}
                    placeholder="New quest..."
                    className="flex-1 bg-background border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                    value={questType}
                    onChange={(e) => setQuestType(e.target.value as QuestType)}
                    className="bg-background border border-input px-2 py-2 rounded-md font-medium text-sm"
                >
                    <option value="BOSS">BOSS</option>
                    <option value="SECONDARY">Main</option>
                    <option value="BONUS">Side</option>
                </select>
                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                    Add
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sortedQuests.map(quest => (
                    <div
                        key={quest.id}
                        className={twMerge(
                            "relative p-4 rounded-lg border flex flex-col gap-2 transition-all group",
                            getStyle(quest.type),
                            quest.completed && "opacity-50 grayscale"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2 font-bold">
                                {getIcon(quest.type)}
                                <span className={clsx(quest.completed && "line-through")}>{quest.title}</span>
                            </div>
                            <button onClick={() => removeQuest(quest.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                            <div className="text-xs text-muted-foreground font-mono">
                                <span className="text-purple-400">+{quest.rewardXP} XP</span>
                                <span className="text-yellow-500 ml-2">+{quest.rewardCoins} G</span>
                            </div>
                            <button
                                onClick={() => toggleQuest(quest.id)}
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                {quest.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestBoard;
