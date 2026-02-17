import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Coins, Settings } from 'lucide-react';
import Avatar from './Avatar';

import SettingsModal from './SettingsModal';
import ShopModal from './ShopModal';

const Header: React.FC = () => {
    const { player } = useGame();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);

    const isMaxLevel = player.level >= 10;
    const xpPercentage = isMaxLevel ? 100 : Math.min(100, (player.currentXP / player.maxXP) * 100);

    return (
        <header className="bg-card border-b border-border p-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10 shadow-md">
            <div className="flex items-center gap-6">
                <div className="shrink-0 relative z-10 w-28 h-28 flex items-center justify-center">
                    <Avatar key={player.avatar} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-primary truncate max-w-[200px]">{player.name}</h1>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-muted-foreground hover:text-white transition-colors p-1"
                            title="Settings"
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-sm text-muted-foreground">Total XP: {player.totalXP}</p>
                </div>
            </div>

            <div className="flex-1 w-full max-w-xl mx-4 md:mx-10">
                <div className="flex justify-between text-xs mb-1 text-muted-foreground font-mono">
                    <span>{isMaxLevel ? "MAX LEVEL" : `XP ${player.currentXP}`}</span>
                    <span>{isMaxLevel ? "∞" : `${player.maxXP} XP`}</span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden relative border border-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-500 ease-out shadow-[0_0_10px_#a855f7]"
                        style={{ width: `${xpPercentage}%` }}
                    />
                </div>
            </div>

            <button
                onClick={() => setIsShopOpen(true)}
                className="flex items-center bg-yellow-900/20 border border-yellow-700/50 px-4 py-2 rounded-lg gap-2 hover:bg-yellow-900/40 transition-colors cursor-pointer group"
                title="Abrir Loja"
            >
                <Coins className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold text-yellow-400 font-mono">{player.coins}</span>
            </button>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
        </header>
    );
};

export default Header;


