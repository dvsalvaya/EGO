import React from 'react';
import { X } from 'lucide-react';
import RewardShop from './RewardShop';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            {/* Overlay click to close */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative bg-card border border-border w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border bg-zinc-900/50 shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
                        <span>🪙</span> Mercado Negro
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content (Scrollable) */}
                <div className="overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    <RewardShop />
                </div>
            </div>
        </div>
    );
};

export default ShopModal;
