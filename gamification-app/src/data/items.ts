import type { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
    // --- Tier 1: Ragged (Level 1+) ---
    { id: 'helm_ragged', name: 'Ragged Hood', type: 'HEAD', cost: 10, icon: 'Shield', description: 'Better than nothing.' },
    { id: 'armor_ragged', name: 'Ragged Tunic', type: 'BODY', cost: 15, icon: 'Shirt', description: 'Full of holes.' },
    { id: 'legs_ragged', name: 'Ragged Pants', type: 'LEGS', cost: 10, icon: 'Scissors', description: 'Drafty.' },

    // --- Tier 2: Leather (Level 3+) ---
    { id: 'helm_leather', name: 'Leather Cap', type: 'HEAD', cost: 50, icon: 'Shield', description: 'Sturdy leather.' },
    { id: 'armor_leather', name: 'Leather Vest', type: 'BODY', cost: 80, icon: 'Shirt', description: 'Light protection.' },
    { id: 'legs_leather', name: 'Leather Pants', type: 'LEGS', cost: 50, icon: 'Scissors', description: 'Flexible.' },

    // --- Tier 3: Iron (Level 5+) ---
    { id: 'helm_iron', name: 'Iron Helmet', type: 'HEAD', cost: 150, icon: 'Shield', description: 'Solid metal.' },
    { id: 'armor_iron', name: 'Iron Plate', type: 'BODY', cost: 250, icon: 'Shirt', description: 'Heavy defense.' },
    { id: 'legs_iron', name: 'Iron Greaves', type: 'LEGS', cost: 150, icon: 'Scissors', description: 'Protects the shins.' },

    // --- Tier 4: Gold (Level 8+) ---
    { id: 'helm_gold', name: 'Golden Crown', type: 'HEAD', cost: 500, icon: 'Crown', description: 'Fit for a king.' },
    { id: 'armor_gold', name: 'Golden Plate', type: 'BODY', cost: 800, icon: 'Shirt', description: 'Shines brightly.' },
    { id: 'legs_gold', name: 'Golden Greaves', type: 'LEGS', cost: 500, icon: 'Scissors', description: 'Walk in luxury.' },

    // --- Tier 5: Void (Level 10+) ---
    { id: 'helm_void', name: 'Void Mask', type: 'HEAD', cost: 2000, icon: 'Sparkles', description: 'Gazes into the abyss.' },
    { id: 'armor_void', name: 'Void Chestplate', type: 'BODY', cost: 3000, icon: 'Flame', description: 'Pulsates with energy.' },
    { id: 'legs_void', name: 'Void Leggings', type: 'LEGS', cost: 2000, icon: 'Sparkles', description: 'Steps through dimensions.' },

    { id: 'sword_wood_2', name: 'Training Greatsword', type: 'WEAPON', cost: 50, icon: 'Sword', description: 'Heavy wood.' },
    { id: 'sword_iron_2', name: 'Iron Greatsword', type: 'WEAPON', cost: 200, icon: 'Sword', description: 'Two-handed power.' },
    { id: 'axe_iron', name: 'Battle Axe', type: 'WEAPON', cost: 250, icon: 'Sword', description: 'Cleaves armor.' },
    { id: 'axe_gold', name: 'Golden Axe', type: 'WEAPON', cost: 600, icon: 'Crown', description: 'Ceremonial but sharp.' },
    { id: 'staff_wood', name: 'Apprentice Staff', type: 'WEAPON', cost: 100, icon: 'Sparkles', description: 'Basic magic.' },

    { id: 'sword_void', name: 'Void Blade', type: 'WEAPON', cost: 2500, icon: 'Sword', description: 'Consumes light.' },
    { id: 'axe_fire', name: 'Inferno Axe', type: 'WEAPON', cost: 2000, icon: 'Flame', description: 'Burns on hit.' },
    { id: 'staff_nature', name: 'Druid Staff', type: 'WEAPON', cost: 1200, icon: 'Sparkles', description: 'Powers of nature.' },
    { id: 'staff_ice', name: 'Frost Staff', type: 'WEAPON', cost: 1500, icon: 'Sparkles', description: 'Freezes enemies.' },
    { id: 'staff_void', name: 'Void Staff', type: 'WEAPON', cost: 3000, icon: 'Sparkles', description: 'Unleashes chaos.' },

    // --- Cosméticos: Molduras (Frames) ---
    { id: 'frame_stone', name: 'Despertar de Pedra', type: 'MOLDURA', cost: 50, icon: 'Circle', description: 'Uma moldura robusta e antiga.' },
    { id: 'frame_iron', name: 'Rúnica de Ferro', type: 'MOLDURA', cost: 200, icon: 'Shield', description: 'Gravada com runas de proteção.' },
    { id: 'frame_cyber', name: 'Núcleo Cyber', type: 'MOLDURA', cost: 500, icon: 'Zap', description: 'Tecnologia avançada pulsante.' },
    { id: 'frame_shadow', name: 'Sombra do Monarca', type: 'MOLDURA', cost: 1000, icon: 'Ghost', description: 'Envolva-se em trevas reais.' },
];
