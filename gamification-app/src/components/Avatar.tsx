import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { User, Crown, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Avatar: React.FC = () => {
    const { player } = useGame();
    // Fallback seguro: garante que level e equipped existam mesmo se o player estiver incompleto
    const level = player?.level || 1;
    const equipped = player?.equipped || {};

    const [imgError, setImgError] = useState(false);



    // Determine base style based on level
    const isGodMode = level >= 10;
    const isMid = level >= 5 && level < 10;

    // Equipped Items Visuals
    // This is a simplified overlaid approach. In a real game you'd layer sprites.
    const renderItem = (slot: 'HEAD' | 'BODY' | 'AURA' | 'MOLDURA') => {
        const itemId = equipped[slot];
        if (!itemId) return null;

        // Frames (MOLDURA) - Rendered centered and scaled
        if (slot === 'MOLDURA') {
            const frameName = itemId.replace('frame_', '');
            return (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                    {/* Scale 1.35 to offset the border and perfectly encircle the 100% avatar */}
                    <img
                        src={`/assets/frames/${frameName}.png`}
                        alt="Frame"
                        className="w-[135%] h-[135%] max-w-none object-contain"
                    />
                </div>
            );
        }

        // Quick map from ID to visual (simplified for this demo)
        if (itemId === 'helm_gold') return <Crown className="absolute -top-5 left-0 right-0 mx-auto w-8 h-8 text-yellow-400 animate-bounce" />;
        if (itemId === 'helm_iron') return <Shield className="absolute -top-4 -right-2 w-6 h-6 text-gray-400" />;
        if (itemId === 'aura_fire') return <div className="absolute -inset-4 bg-orange-500/20 blur-xl rounded-full -z-10 animate-pulse" />;
        if (itemId === 'aura_void') return <div className="absolute -inset-6 bg-violet-600/30 blur-2xl rounded-full -z-10 animate-pulse" />;
        // Body is hard to overlay on a User icon without Svgs, so we can change container color
        return null;
    };

    return (
        <div className="relative group">
            {/* Aura Layer */}
            {renderItem('AURA')}

            <div className={twMerge(
                "relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500",
                // Level 1-4: Basic
                level < 5 && "bg-zinc-800 border-2 border-zinc-700 grayscale-[0.5]",
                // Level 5-9: Advanced
                isMid && "bg-zinc-800 border-4 border-primary shadow-[0_0_15px_rgba(168,85,247,0.4)]",
                // Level 10: God Mode
                isGodMode && "bg-black border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.8)] scale-110",
                // Body Armor Effect (changes bg color)
                equipped.BODY === 'armor_plate' && "bg-slate-800",
                equipped.BODY === 'armor_legend' && "bg-yellow-950/50"
            )}>
                {player.avatar && !imgError ? (
                    <img
                        src={player.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full border-2 border-white/10"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-zinc-700 rounded-full">
                        <User
                            data-testid="avatar-user-icon"
                            className={clsx(
                                "w-12 h-12 transition-all",
                                level < 5 && "text-zinc-400",
                                isMid && "text-primary",
                                isGodMode && "text-yellow-400 animate-pulse"
                            )} />
                    </div>
                )}

                {/* Head Layer */}
                {renderItem('HEAD')}

                {/* Level Badge */}
                <div className={clsx(
                    "absolute -bottom-2 z-50 bg-background px-2 py-0.5 rounded-full text-xs font-bold border",
                    isGodMode ? "border-yellow-500 text-yellow-500" : "border-border text-muted-foreground"
                )}>
                    Lvl {level}
                </div>

                {/* Frame Layer (Topmost) */}
                {renderItem('MOLDURA')}
            </div>

            {/* Tooltip */}
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-xs px-2 py-1 rounded border border-zinc-800">
                {isGodMode ? "LEGENDARY STATUS" : level >= 5 ? "Elite Warrior" : "Novice"}
            </div>
        </div>
    );
};

export default Avatar;
