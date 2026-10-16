# Secure Compress — Desktop App (Windows)

Electron wrapper around the Secure Compress website. Everything (PDF/Word engines,
OCR engine + English model, fonts) is bundled, so the app works fully offline.

## Run in development
    npm install
    npm start

## Build the Windows installer (setup.exe)
    npm install
    npm run build:win
The installer is written to `dist/Secure-Compress-Setup.exe`.

## Notes
- Website files live in `app/`. Edit them, then rebuild.
- Installer icon / app icon: `build/icon.ico`
- The installer is unsigned, so Windows SmartScreen may warn on first run.
  A code-signing certificate removes the warning.
