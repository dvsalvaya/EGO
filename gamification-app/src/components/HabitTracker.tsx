import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';

const HabitTracker: React.FC = () => {
    const { habits, addHabit, removeHabit, performHabit } = useGame();
    // Estado local para o formulário (input de texto e números)
    const [newHabit, setNewHabit] = useState('');
    const [xpReward, setXpReward] = useState(10);
    const [xpPenalty, setXpPenalty] = useState(10);

    // Manipulador de envio do formulário
    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault(); // Evita recarrregar a página (comportamento padrão de forms HTML)
        if (!newHabit.trim()) return; // Validação: não aceita vazio
        addHabit({
            title: newHabit,
            xpReward,
            xpPenalty
        });
        setNewHabit(''); // Limpa o input
    };

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-secondary" />
                Daily Habits
            </h2>

            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="New habit..."
                    className="flex-1 bg-background border border-input px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={xpReward}
                        onChange={(e) => setXpReward(Number(e.target.value))}
                        className="w-20 bg-background border border-input px-2 py-2 rounded-md text-center text-green-500 text-sm"
                        title="XP Reward"
                    />
                    <input
                        type="number"
                        value={xpPenalty}
                        onChange={(e) => setXpPenalty(Number(e.target.value))}
                        className="w-20 bg-background border border-input px-2 py-2 rounded-md text-center text-red-500 text-sm"
                        title="XP Penalty"
                    />
                    <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                        Add
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                {habits.length === 0 && <p className="text-muted-foreground text-center py-4 italic">No habits tracking yet.</p>}
                {habits.map(habit => (
                    <div key={habit.id} className="group flex items-center justify-between bg-background/50 border border-border p-3 rounded-lg hover:border-primary/50 transition-colors">
                        <div className="flex-1">
                            <p className="font-medium">{habit.title}</p>
                            <p className="text-xs text-muted-foreground">+{habit.xpReward} XP / -{habit.xpPenalty} XP</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => performHabit(habit.id, true)}
                                className="p-2 hover:bg-green-500/20 text-green-500 rounded-md transition-colors"
                                title="Done (+XP)"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => performHabit(habit.id, false)}
                                className="p-2 hover:bg-red-500/20 text-red-500 rounded-md transition-colors"
                                title="Fail (-XP)"
                            >
                                <Minus className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => removeHabit(habit.id)}
                                className="p-2 hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HabitTracker;
