import React from 'react';
import { useGame } from '../context/GameContext';
import { X, Sword, Shield, Shirt, Footprints, Crown, Sparkles, User, Scissors } from 'lucide-react';
import { clsx } from 'clsx';


interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
    const { player, shopItems, equipItem } = useGame();

    if (!isOpen) return null;

    // Filter items owned by player
    const ownedItems = shopItems.filter(item => player.inventory.includes(item.id));

    // Get currently equipped ID for a slot
    const getEquippedId = (slot: string) => {
        return player.equipped[slot as keyof typeof player.equipped];
    };

    // Helper to generic icon
    const getIcon = (iconName: string) => {
        if (iconName === 'Sword') return <Sword className="w-5 h-5" />;
        if (iconName === 'Shield') return <Shield className="w-5 h-5" />;
        if (iconName === 'Shirt') return <Shirt className="w-5 h-5" />;
        if (iconName === 'Crown') return <Crown className="w-5 h-5" />;
        if (iconName === 'Flame') return <Sparkles className="w-5 h-5 text-orange-500" />;
        if (iconName === 'Sparkles') return <Sparkles className="w-5 h-5 text-purple-500" />;
        if (iconName === 'Footprints') return <Footprints className="w-5 h-5" />;
        if (iconName === 'Scissors') return <Scissors className="w-5 h-5" />;
        return <User className="w-5 h-5" />;
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Equipment & Inventory</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {ownedItems.length === 0 ? (
                        <div className="text-center text-zinc-500 py-10">
                            Your inventory is empty. Visit the Shop to buy equipment!
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {ownedItems.map(item => {
                                const isEquipped = getEquippedId(item.type) === item.id;
                                return (
                                    <div
                                        key={item.id}
                                        className={clsx(
                                            "bg-zinc-800 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-zinc-700 flex flex-col items-center gap-2",
                                            isEquipped ? "border-primary shadow-[0_0_10px_theme(colors.purple.500)]" : "border-transparent"
                                        )}
                                        onClick={() => equipItem(item.id)}
                                    >
                                        <div className="p-2 bg-zinc-900 rounded-full">
                                            {getIcon(item.icon)}
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-sm text-foreground">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.type}</p>
                                        </div>
                                        {isEquipped && (
                                            <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full mt-1">
                                                Equipped
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-zinc-950/50 rounded-b-xl text-xs text-center text-muted-foreground">
                    Click an item to toggle equip/unequip.
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;
