const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  updateTray: (missions) => ipcRenderer.send('update-tray-missions', missions),
  db: {
    load: () => ipcRenderer.invoke('db:load'),
    savePlayer: (player) => ipcRenderer.send('db:save-player', player),
    saveHabits: (habits) => ipcRenderer.send('db:save-habits', habits),
    saveQuests: (quests) => ipcRenderer.send('db:save-quests', quests),
    saveRewards: (rewards) => ipcRenderer.send('db:save-rewards', rewards),
    updateInventory: (items) => ipcRenderer.send('db:update-inventory', items),
    updateEquipped: (equipped) => ipcRenderer.send('db:update-equipped', equipped),
    addHistory: (date, xp) => ipcRenderer.send('db:add-history', {date, xp})
  }
});
