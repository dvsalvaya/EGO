import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Shirt, Shield, Sword, User, Crown, Footprints, Scissors } from 'lucide-react';
import { clsx } from 'clsx';
import InventoryModal from './InventoryModal';

// --- AvatarLayer Component ---
interface AvatarLayerProps {
    src: string;
    fallback: React.ReactNode;
    className?: string; // Positioning & Sizing (Always applied)
    fallbackClassName?: string; // Styling for the fallback box (Only applied on error)
    alt: string;
}

const AvatarLayer: React.FC<AvatarLayerProps> = ({ src, fallback, className, fallbackClassName, alt }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return <div className={clsx(className, fallbackClassName)}>{fallback}</div>;
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

// --- Style Configuration ---
type BodyType = 'skinny' | 'athletic' | 'muscular' | 'hero';

const STYLE_CONFIG: Record<BodyType, {
    base: string;
    armor: string;
    legs: string;
    boots: string;
    head: string;
    weapon: string;
    shield: string;
}> = {
    skinny: {
        base: "w-24",
        armor: "w-26 top-[4.5rem]",
        legs: "w-[4.5rem] bottom-6",
        boots: "w-24 bottom-0",
        head: "w-20 h-20 top-0 scale-100",
        weapon: "w-28 h-28 top-24 -right-6",
        shield: "w-20 h-20 top-32 -left-6"
    },
    athletic: {
        base: "w-32",
        armor: "w-[8.5rem] top-[4rem]",
        legs: "w-20 bottom-6",
        boots: "w-28 bottom-0",
        head: "w-22 h-22 -top-2 scale-105",
        weapon: "w-32 h-32 top-20 -right-8",
        shield: "w-24 h-24 top-28 -left-8"
    },
    muscular: {
        base: "w-36",
        armor: "w-[9.5rem] top-[3.5rem]",
        legs: "w-24 bottom-6",
        boots: "w-32 bottom-0",
        head: "w-24 h-24 -top-3 scale-110",
        weapon: "w-36 h-36 top-16 -right-10",
        shield: "w-28 h-28 top-24 -left-10"
    },
    hero: {
        base: "w-40",
        armor: "w-[11rem] top-[3rem]",
        legs: "w-28 bottom-5",
        boots: "w-36 bottom-0",
        head: "w-28 h-28 -top-5 scale-110",
        weapon: "w-40 h-40 top-12 -right-12",
        shield: "w-32 h-32 top-20 -left-12"
    }
};

const FullBodyAvatar: React.FC = () => {
    const { player } = useGame();
    const { equipped, level } = player;
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    // Helper: Dynamic Asset Path
    const resolveAssetPath = (category: string, itemId: string | undefined, extension = 'png') => {
        if (!itemId) return '';
        return `/assets/avatar/${category}/${itemId}.${extension}`;
    };

    // Body Type logic
    const getBodyType = (): BodyType => {
        if (level < 4) return 'skinny';   // Lvl 1-3
        if (level < 7) return 'athletic'; // Lvl 4-6
        if (level < 10) return 'muscular'; // Lvl 7-9
        return 'hero';                    // Lvl 10+
    };

    const bodyType = getBodyType();
    const styles = STYLE_CONFIG[bodyType];
    const bodyAsset = `/assets/avatar/body/base_${bodyType}.png`;

    return (
        <>
            <div
                className="relative w-48 h-72 sm:w-64 sm:h-96 mx-auto cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={() => setIsInventoryOpen(true)}
                title="Click to Open Inventory"
            >
                {/* --- Layer 0: Background/Aura --- */}
                {equipped.AURA === 'aura_fire' && (
                    <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
                )}
                {equipped.AURA === 'aura_void' && (
                    <div className="absolute inset-0 bg-purple-600/30 blur-3xl rounded-full animate-pulse" />
                )}

                {/* --- Layer 1: Base Body --- */}
                <AvatarLayer
                    src={bodyAsset}
                    alt="Body Base"
                    className={clsx(
                        "absolute inset-x-0 bottom-0 top-8 mx-auto object-contain",
                        styles.base
                    )}
                    fallbackClassName={clsx(
                        "bg-zinc-800 rounded-t-3xl rounded-b-lg border-2 border-zinc-700 flex items-center justify-center text-zinc-600",
                        bodyType === 'hero' && "bg-zinc-700 border-zinc-600"
                    )}
                    fallback={
                        <User className={clsx(
                            "w-full h-full opacity-20 p-2",
                            bodyType === 'hero' && "stroke-[3px]"
                        )} />
                    }
                />

                {/* --- Layer 2: Legs --- */}
                {equipped.LEGS && (
                    <AvatarLayer
                        src={resolveAssetPath('legs', equipped.LEGS)}
                        alt="Legs"
                        className={clsx(
                            "absolute left-0 right-0 mx-auto object-contain z-1",
                            styles.legs
                        )}
                        fallbackClassName="bg-blue-900 rounded-md border-2 border-blue-950 flex items-center justify-center h-32"
                        fallback={
                            <Scissors className="text-white/30 w-8 h-8" />
                        }
                    />
                )}

                {/* --- Layer 3: Boots --- */}
                {equipped.BOOTS && (
                    <AvatarLayer
                        src={resolveAssetPath('boots', equipped.BOOTS)}
                        alt="Boots"
                        className={clsx(
                            "absolute left-0 right-0 mx-auto object-contain z-2",
                            styles.boots
                        )}
                        fallback={
                            <div className="absolute bottom-0 left-0 right-0 w-24 mx-auto flex justify-between px-2">
                                <div className="w-8 h-6 bg-amber-900 rounded border border-amber-950 flex items-center justify-center"><Footprints className="w-4 h-4 text-white/30" /></div>
                                <div className="w-8 h-6 bg-amber-900 rounded border border-amber-950 flex items-center justify-center"><Footprints className="w-4 h-4 text-white/30" /></div>
                            </div>
                        }
                    />
                )}

                {/* --- Layer 4: Body Armor --- */}
                {equipped.BODY && (
                    <AvatarLayer
                        src={resolveAssetPath('armor', equipped.BODY)}
                        alt="Armor"
                        className={clsx(
                            "absolute left-0 right-0 mx-auto object-contain z-3",
                            styles.armor
                        )}
                        fallbackClassName={clsx(
                            "rounded-xl flex items-center justify-center h-40",
                            bodyType === 'skinny' && "bg-slate-700",
                            bodyType === 'athletic' && "bg-slate-600",
                            bodyType === 'hero' && "bg-yellow-900 border-2 border-yellow-500"
                        )}
                        fallback={
                            <Shirt className="text-white/50 w-12 h-12" />
                        }
                    />
                )}

                {/* --- Layer 5: Head --- */}
                <div className={clsx("absolute left-0 right-0 mx-auto z-10", styles.head)}>
                    {equipped.HEAD && (
                        <AvatarLayer
                            src={resolveAssetPath('head', equipped.HEAD)}
                            alt="Head"
                            className="w-full h-full object-contain drop-shadow-lg"
                            fallback={
                                equipped.HEAD === 'helm_gold' ? (
                                    <Crown className="absolute -top-6 left-0 right-0 mx-auto text-yellow-500 w-10 h-10 drop-shadow-lg" />
                                ) : (
                                    <div className="absolute inset-0 bg-gray-400 rounded-full border-4 border-gray-600 opacity-90" />
                                )
                            }
                        />
                    )}
                </div>

                {/* --- Layer 6: Main Hand (Weapon) --- */}
                {equipped.WEAPON && (
                    <AvatarLayer
                        src={resolveAssetPath('weapon', equipped.WEAPON)}
                        alt="Weapon"
                        className={clsx(
                            "absolute object-contain z-20 origin-bottom-left rotate-12",
                            styles.weapon
                        )}
                        fallback={
                            <div className="absolute top-24 -right-12 w-24 h-24 origin-bottom-left rotate-12 z-20">
                                <Sword className="w-full h-full text-slate-300 drop-shadow-md" />
                            </div>
                        }
                    />
                )}

                {/* --- Layer 7: Off Hand (Shield) --- */}
                {equipped.SHIELD && (
                    <AvatarLayer
                        src={resolveAssetPath('shield', equipped.SHIELD)}
                        alt="Shield"
                        className={clsx(
                            "absolute object-contain z-20",
                            styles.shield
                        )}
                        fallback={
                            <div className="absolute top-32 -left-8 w-20 h-20 z-20">
                                <Shield className="w-full h-full text-amber-700 fill-amber-900/50 drop-shadow-xl" />
                            </div>
                        }
                    />
                )}

                {/* Tooltip hint */}
                <div className="absolute -bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    Click to Open Equipment
                </div>
            </div>

            <InventoryModal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
        </>
    );
};

export default FullBodyAvatar;
