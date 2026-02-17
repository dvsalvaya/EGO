import React from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingBag, Shield, Crown, Shirt, ShieldCheck, Flame, Sparkles, Sword, Footprints, Scissors, Check } from 'lucide-react';
import { clsx } from 'clsx';
import type { ShopItem } from '../types';

const RewardShop: React.FC = () => {
    const { shopItems, player, buyItem, equipItem } = useGame();

    // Icon Mapping
    const getIcon = (name: string) => {
        switch (name) {
            case 'Shield': return <Shield className="w-5 h-5" />;
            case 'Crown': return <Crown className="w-5 h-5" />;
            case 'Shirt': return <Shirt className="w-5 h-5" />;
            case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
            case 'Flame': return <Flame className="w-5 h-5" />;
            case 'Sparkles': return <Sparkles className="w-5 h-5" />;
            case 'Sword': return <Sword className="w-5 h-5" />;
            case 'Footprints': return <Footprints className="w-5 h-5" />;
            case 'Scissors': return <Scissors className="w-5 h-5" />;
            default: return <ShoppingBag className="w-5 h-5" />;
        }
    };

    // Badge Label Mapping (English internal -> Portuguese display)
    const getBadgeLabel = (type: string) => {
        switch (type) {
            case 'HEAD': return 'CABEÇA';
            case 'BODY': return 'CORPO';
            case 'LEGS': return 'PERNAS';
            case 'BOOTS': return 'BOTAS';
            case 'WEAPON': return 'ARMA';
            case 'SHIELD': return 'ESCUDO';
            case 'AURA': return 'AURA';
            case 'MOLDURA': return 'MOLDURA';
            default: return type;
        }
    };

    const isOwned = (id: string) => player.inventory.includes(id);
    const isEquipped = (item: ShopItem) => player.equipped[item.type] === item.id;

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-400">
                <ShoppingBag />
                Loja de Equipamentos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems
                    .filter(item => ['AURA', 'MOLDURA'].includes(item.type)) // Show Molduras in v1.0
                    .map(item => {
                        const owned = isOwned(item.id);
                        const equipped = isEquipped(item);

                        return (
                            <div key={item.id} className={clsx(
                                "relative p-4 rounded-lg border transition-all flex flex-col justify-between gap-3",
                                equipped ? "border-yellow-500 bg-yellow-900/10" : "border-border bg-background/50 hover:bg-zinc-800/50"
                            )}>
                                {/* Header: Icon + Badge */}
                                <div className="flex justify-between items-start">
                                    <div className={clsx(
                                        "p-2 rounded-md",
                                        equipped ? "bg-yellow-900/30 text-yellow-400" : "bg-zinc-900 text-primary"
                                    )}>
                                        {getIcon(item.icon)}
                                    </div>
                                    <span className={clsx(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                        ['AURA', 'MOLDURA'].includes(item.type)
                                            ? "bg-purple-900/30 border-purple-500 text-purple-300" // Moldura style
                                            : "bg-zinc-800 border-zinc-700 text-muted-foreground"
                                    )}>
                                        {getBadgeLabel(item.type)}
                                    </span>
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="font-bold text-sm tracking-wide">{item.name}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                </div>

                                {/* Action Button */}
                                {owned ? (
                                    <button
                                        onClick={() => equipItem(item.id)}
                                        className={clsx(
                                            "w-full py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-wider",
                                            equipped
                                                ? "bg-yellow-600 text-white cursor-default shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                                                : "bg-zinc-700 hover:bg-zinc-600 text-zinc-300"
                                        )}
                                    >
                                        {equipped ? <><Check className="w-3 h-3" /> Equipado</> : "Equipar"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => buyItem(item.id)}
                                        disabled={player.coins < item.cost}
                                        className="w-full py-1.5 rounded bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-1 uppercase tracking-wider"
                                    >
                                        <span>Comprar</span>
                                        <span className="text-yellow-300 ml-1">{item.cost} G</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default RewardShop;
