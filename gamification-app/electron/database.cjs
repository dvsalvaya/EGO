const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Location: AppData/Roaming/GamificationApp/gamification_storage.json
const dbPath = path.join(app.getPath('userData'), 'gamification_storage.json');

// In-Memory Database State
let db = {
    player: {
        id: 1,
        name: "Player One",
        level: 1,
        currentXP: 0,
        maxXP: 10,
        coins: 0,
        totalXP: 0,
        avatar: null,
        inventory: [],
        equipped: {}
    },
    habits: [],
    quests: [],
    rewards: [],
    history: [] // { id, date, xp }
};

function initDB() {
    try {
        if (fs.existsSync(dbPath)) {
            const raw = fs.readFileSync(dbPath, 'utf8');
            const saved = JSON.parse(raw);
            
            // Merge logic to ensure schema updates don't break old saves
            db = {
                ...db,
                ...saved,
                player: { ...db.player, ...saved.player }
            };
            console.log("Database loaded from:", dbPath);
        } else {
            saveToDisk(); // Create initial file
            console.log("New Database created at:", dbPath);
        }
    } catch (e) {
        console.error("Failed to init DB:", e);
        // Backup corrupted file to avoid data loss
        if (fs.existsSync(dbPath)) {
            const backupPath = dbPath + '.corrupt-' + Date.now() + '.bak';
            try {
                fs.copyFileSync(dbPath, backupPath);
                console.log("Corrupted DB backed up to:", backupPath);
            } catch (backupErr) {
                console.error("Failed to backup corrupted DB:", backupErr);
            }
        }
    }
}

function saveToDisk() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    } catch (e) {
        console.error("Failed to save DB:", e);
    }
}

// ============== API Functions ("SQL-like" Logic) ==============

function loadState() {
    // Return a clean copy
    return JSON.parse(JSON.stringify({
        player: db.player,
        habits: db.habits,
        quests: db.quests,
        rewards: db.rewards
    }));
}

function savePlayer(playerData) {
    db.player = { ...db.player, ...playerData };
    saveToDisk();
}

// Append-only history log (Simulates INSERT)
function addHistory(date, xp) {
    // Check for existing entry today to aggregate (Optional, keeping simpler)
    const existingIndex = db.history.findIndex(h => h.date === date);
    
    if (existingIndex >= 0) {
        db.history[existingIndex].xp += xp;
    } else {
        db.history.push({
            id: Date.now(),
            date,
            xp
        });
    }
    
    // Keep only last 365 entries
    if (db.history && db.history.length > 365) {
        db.history = db.history.slice(-365);
    }
    
    saveToDisk();
}

// Bulk Syncs (Simulates Transactions)
function saveHabits(habits) {
    db.habits = habits; 
    saveToDisk();
}

function saveQuests(quests) {
    db.quests = quests;
    saveToDisk();
}

function saveRewards(rewards) {
    db.rewards = rewards;
    saveToDisk();
}

function updateInventory(inventoryIds) {
    // Set format -> array
    const unique = [...new Set([...db.player.inventory, ...inventoryIds])];
    db.player.inventory = unique;
    saveToDisk();
}

function updateEquipped(equippedMap) {
    db.player.equipped = { ...db.player.equipped, ...equippedMap };
    saveToDisk();
}

module.exports = {
    initDB,
    loadState,
    savePlayer,
    saveHabits,
    saveQuests,
    saveRewards,
    updateInventory,
    updateEquipped,
    addHistory
};
