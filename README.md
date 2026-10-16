# Secure Compress — Desktop App (Windows)

# Secure Compress

Secure Compress is a client-side tool for compressing large PDF files without uploading them to any server. It’s ideal for compressing confidential or official documents while keeping them private — all compression runs in the user’s browser or on their machine.

Features
- Client-side PDF compression — files never leave the user’s device
- Simple drag & drop or file selector UI
- Choose compression/quality presets
- Fast processing for large PDFs
- Zero-knowledge: no server storage or telemetry by default

Privacy & security
- All processing happens locally in the browser / on the client machine.
- No files are uploaded to any third-party servers by Secure Compress.
- Recommend running the app locally (see Install) or deploying to a self-hosted environment you control.

Quick start (development)
1. Clone the repo:
   git clone https://github.com/Musnany/Secure-Compress.git
2. Install dependencies:
   npm install
3. Start the dev server:
   npm start
4. Open http://localhost:3000 (or the address printed by your dev server) and drag-and-drop or choose a PDF to compress.

Quick start (static)
- If the project is a static frontend, you can often just open `index.html` in a browser or serve the folder with a static server:
  npx serve .

Usage
- Open the app, select a PDF (or drag & drop).
- Choose a compression level (e.g., High/Medium/Low or numeric quality).
- Start compression and download the resulting PDF when finished.
- For large PDFs, allow time for processing; consider providing progress UI for long-running operations.

Suggested UI/UX improvements
- Progress indicator for large files
- Preview of file size before/after compression
- Retry/cancel button
- Accessibility: keyboard support, proper labels for screen readers

Development notes & suggestions
- Use client-side PDF libraries (e.g., pdf-lib, pdf.js, or any wasm-based library) that support compression without external upload.
- Keep dependencies minimal to reduce bundle size and reduce attack surface.
- Consider Web Worker(s) for heavy processing to keep the UI responsive.
- Add tests for core compression routines and UI flows.

CI / Deployment
- Add a simple CI workflow to run lint/tests (GitHub Actions).
- Optionally deploy a demo via GitHub Pages or a static host (Netlify/Vercel) — ensure the deployed demo includes a clear privacy statement.

Contributing
- Contributions welcome — please open issues for bugs or feature requests.
- Suggested PR workflow:
  - Fork the repo
  - Create a feature branch
  - Add tests where applicable
  - Open a pull request describing the change

License
- Suggested: MIT License (or choose a license that fits your project requirements).
- Add a LICENSE file with chosen license text.

Contact
- Maintainer: Musnany
- For security/privacy issues, open an issue or contact directly via the repository.

---

