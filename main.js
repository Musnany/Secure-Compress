const { app, BrowserWindow, Menu, shell, session } = require('electron');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, 'app');
const ICON = path.join(__dirname, 'build', 'icon.png');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.gz': 'application/gzip',
  '.wasm': 'application/wasm'
};

let server = null;
let origin = '';
let mainWindow = null;

// The app's pages are served from a tiny server that only listens on this
// computer (127.0.0.1) on a random free port. Web features the tools depend
// on — notably the background workers used by OCR and PDF reading — are
// blocked by browsers for pages opened straight from disk, but work normally
// when the page comes from an address like this one.
function startServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      try {
        let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        if (pathname === '/') pathname = '/index.html';
        const file = path.normalize(path.join(ROOT, pathname));
        if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
          res.writeHead(403); res.end('Forbidden'); return;
        }
        fs.readFile(file, (err, data) => {
          if (err) { res.writeHead(404); res.end('Not found'); return; }
          res.writeHead(200, {
            'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-cache'
          });
          res.end(data);
        });
      } catch (e) {
        res.writeHead(400); res.end('Bad request');
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      origin = 'http://127.0.0.1:' + server.address().port;
      resolve();
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 860,
    minWidth: 900,
    minHeight: 640,
    title: 'Secure Compress',
    icon: ICON,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.loadURL(origin + '/index.html');

  // Links to other sites (e.g. the developer's LinkedIn) open in the user's
  // normal browser, never inside the app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(origin)) {
      event.preventDefault();
      if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);
    // The tools never need camera, microphone, location, etc.
    session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(false));
    await startServer();
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });

  app.on('window-all-closed', () => {
    if (server) server.close();
    app.quit();
  });
}
