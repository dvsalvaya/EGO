import React from 'react';
import { useGame } from '../context/GameContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

const StatsGraph: React.FC = () => {
    const { player } = useGame();

    // Prepare data (ensure at least some data points for visualization)
    const data = player.history.length > 0 ? player.history : [{ date: 'Today', xp: 0 }];

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                XP Evolution
            </h2>

            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#666' }}
                            tickFormatter={(val) => val.split('-').slice(1).join('/')}
                        />
                        <YAxis tick={{ fontSize: 10, fill: '#666' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="xp"
                            stroke="#a855f7"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#a855f7' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StatsGraph;
