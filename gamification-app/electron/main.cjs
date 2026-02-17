const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;
let isQuitting = false;

// Helper to handle icon path differences between Dev and Prod
function getIconPath() {
    return app.isPackaged
        ? path.join(__dirname, '../dist/icon.ico') // Prod: Vite copies assets to dist
        : path.join(__dirname, '../public/icon.ico'); // Dev: Direct access
}

function createWindow() {
  // Cria a janela do sistema operacional
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // Script de segurança (ponte entre Node e UI)
      nodeIntegration: false, // Segurança: impede UI de rodar comandos de sistema direto
      contextIsolation: true, // Segurança: isola o contexto da janela
    },
    backgroundColor: '#09090b', // Cor de fundo inicial (evita flash branco)
    title: 'EGO',
    autoHideMenuBar: true, // Esconde menu padrão do Windows/Linux
    icon: getIconPath()
  });

  // Em produção (Build), carrega o arquivo estático gerado.
  // Em desenvolvimento, conecta no localhost do Vite.
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Behavior: Minimize to Tray on Close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });
}

function createTray() {
  const icon = nativeImage.createFromPath(getIconPath());
  tray = new Tray(icon);
  tray.setToolTip('EGO - Gamification');

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
        mainWindow.hide();
    } else {
        mainWindow.show();
        mainWindow.focus();
    }
  });

  updateTrayMenu([]); // Initialize with empty menu
}

function updateTrayMenu(missions) {
    if (!tray) return;

    const template = [];

    // Header / Missions
    if (missions && missions.length > 0) {
        template.push({ label: '--- Missões Pendentes ---', enabled: false });
        missions.forEach(mission => {
            template.push({ label: `• ${mission}`, enabled: false });
        });
    } else {
        template.push({ label: 'Nenhuma missão pendente', enabled: false });
    }

    template.push({ type: 'separator' });

    // Controls
    template.push({
        label: 'Abrir EGO',
        click: () => mainWindow.show()
    });

    const loginSettings = app.getLoginItemSettings();
    template.push({
        label: 'Iniciar com o Windows',
        type: 'checkbox',
        checked: loginSettings.openAtLogin,
        click: (item) => {
            app.setLoginItemSettings({
                openAtLogin: item.checked,
                path: app.getPath('exe') // Segurança para garantir o path correto
            });
        }
    });

    template.push({
        label: 'Sair',
        click: () => {
            isQuitting = true;
            app.quit();
        }
    });

    const contextMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // We do NOT quit here because of tray, unless explicitly quitting
  }
});

// ================== TRAY IPC ==================
ipcMain.on('update-tray-missions', (event, missions) => {
    updateTrayMenu(missions);
});

// ================== DATABASE IPC ==================
const db = require('./database.cjs');


// Init DB on start
db.initDB();

// Handlers
ipcMain.handle('db:load', () => {
    return db.loadState();
});

ipcMain.on('db:save-player', (event, player) => {
    db.savePlayer(player);
});

ipcMain.on('db:save-habits', (event, habits) => {
    db.saveHabits(habits);
});

ipcMain.on('db:save-quests', (event, quests) => {
    db.saveQuests(quests);
});

ipcMain.on('db:save-rewards', (event, rewards) => {
    db.saveRewards(rewards);
});

ipcMain.on('db:update-inventory', (event, items) => {
    db.updateInventory(items);
});

ipcMain.on('db:update-equipped', (event, equipped) => {
    db.updateEquipped(equipped);
});

ipcMain.on('db:add-history', (event, {date, xp}) => {
    db.addHistory(date, xp);
});
