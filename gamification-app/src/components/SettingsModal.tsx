import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { X, Save, Upload, Trash2, AlertTriangle, Download } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { player, habits, quests, rewards, updatePlayerName, updatePlayerAvatar, importSave, resetGame } = useGame();
    const [nameInput, setNameInput] = useState(player.name);
    const [confirmReset, setConfirmReset] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleSaveName = () => {
        if (nameInput.trim()) {
            updatePlayerName(nameInput);
            alert("Name Updated!");
        }
    };

    const handleExport = () => {
        const data = { player, habits, quests, rewards };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gamification-save-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                importSave(content);
                alert("Save Loaded Successfully!");
                onClose();
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (confirmReset === 'DELETE') {
            resetGame();
            setConfirmReset('');
            onClose();
            alert("Game Reset!");
        } else {
            alert("Please type DELETE to confirm.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border bg-zinc-900/50">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-primary">⚙️</span> Settings
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto max-h-[80vh]">

                    <section className="space-y-3">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Profile</h3>

                        {/* Avatar Upload */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 bg-zinc-800">
                                {player.avatar ? (
                                    <img src={player.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                        <span className="text-xs">No Img</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded-md border border-zinc-700 transition-colors flex items-center gap-2">
                                    <Upload className="w-3 h-3" /> Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    const base64 = reader.result as string;
                                                    // Simple validation to prevent massive strings (optional limit 500KB)
                                                    if (base64.length > 700000) {
                                                        alert("Image too large! Please upload strictly under 500KB.");
                                                        return;
                                                    }
                                                    updatePlayerAvatar(base64);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                                {player.avatar && (
                                    <button
                                        onClick={() => updatePlayerAvatar('')}
                                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                className="flex-1 bg-background border border-input px-3 py-2 rounded-md focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Enter Name"
                            />
                            <button onClick={handleSaveName} className="bg-primary/20 text-primary hover:bg-primary/30 px-3 rounded-md border border-primary/50 transition-colors">
                                <Save className="w-4 h-4" />
                            </button>
                        </div>
                    </section>

                    {/* Data Section */}
                    <section className="space-y-3">
                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Data Management</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleExport} className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-border rounded-lg transition-all group">
                                <Download className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Export Save</span>
                            </button>

                            <button onClick={handleImportClick} className="flex flex-col items-center gap-2 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-border rounded-lg transition-all group">
                                <Upload className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Import Save</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".json"
                                className="hidden"
                            />
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="space-y-4 pt-4 border-t border-red-900/30">
                        <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Danger Zone
                        </h3>

                        <div className="border border-red-500/20 bg-red-950/10 p-4 rounded-lg space-y-3">
                            <p className="text-xs text-red-300">
                                Resetting will delete ALL progress, items, and stats effectively immediately. This action cannot be undone.
                            </p>

                            <div className="space-y-2">
                                <label className="text-xs text-muted-foreground">Type <span className="font-mono font-bold text-white">DELETE</span> to confirm:</label>
                                <input
                                    type="text"
                                    value={confirmReset}
                                    onChange={(e) => setConfirmReset(e.target.value)}
                                    className="w-full bg-red-950/20 border border-red-900 px-3 py-2 rounded text-red-200 placeholder:text-red-900/50 focus:border-red-500 outline-none"
                                    placeholder="DELETE"
                                />
                            </div>

                            <button
                                onClick={handleReset}
                                disabled={confirmReset !== 'DELETE'}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 rounded flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-red-900/20"
                            >
                                <Trash2 className="w-4 h-4" />
                                RESET PROGRESS
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
