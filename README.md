# 📖 BookMaker — The In-Browser Book Authoring Studio

> **Write, format, design, and publish professional books entirely in your browser.**  
> *Zero signup required • 100% In-Browser Local Storage • Professional PDF Export • Open Source.*

---

## ✨ Features

- **🛡️ 100% Client-Side & Zero Signup**:
  - No account creation, login screens, passwords, or cloud databases.
  - Everything is auto-saved in the background directly inside your web browser's persistent storage engine (`localStorage`).
  - Total privacy: your ideas, manuscripts, and drafts never leave your device.
  - Full offline capability.

- **📄 Local PDF Generation & Export**:
  - Direct local client-side compilation to printable PDF via vector rendering engine.
  - Formats supported:
    - **6" × 9" Trade Paperback** (Standard for Amazon KDP, IngramSpark, Barnes & Noble)
    - **A5 Digest** (148 × 210 mm)
    - **A4 Manuscript** (210 × 297 mm)
    - **US Letter** (8.5" × 11")
  - Complete literary structure:
    - Full-bleed front cover page with custom colors, emblems, and typography
    - Interior half-title & formal title pages
    - Dedication, epigraph, and copyright notice
    - Auto-generated Table of Contents with page dot-leaders
    - Dynamic running headers and centered page numbering
    - Clean paragraph formatting and scene break dividers (`* * *`)
  - **Browser Native Print-to-PDF**: Formatted `@media print` layout for ultra-high-resolution browser printing.
  - Alternative local exports: **Markdown (`.md`)** and **Plain Text (`.txt`)**.

- **🎨 Visual Book Cover Designer**:
  - Realistic 3D paperback book mockup with live interactive preview.
  - Color palette presets (Midnight & Gold, Imperial Crimson, Emerald Classic, Parchment & Sepia, Monochrome Noir, etc.) and custom hex pickers.
  - Cover emblem ornaments (Quill Feather, Open Book, Guiding Star, Crown, Compass, Ancient Tree).
  - Fine typography options (Cinzel classical serif, Playfair Display literary serif, Merriweather, Modern Sans).

- **✍️ Distraction-Free Authoring Studio**:
  - Markdown-friendly rich toolbar (Bold, Italic, Section Headings, Blockquotes, Scene Breaks, Lists).
  - Zen Mode: single-click toggle to eliminate all UI distractions for focused drafting.
  - Font choices: Merriweather Serif, Inter Sans, Playfair Display, Fira Code Mono.
  - Font size and line-height adjustments.
  - Chapter scratchpad: private notes drawer for outline and character thoughts.
  - Live statistics: word count, character count, and estimated reading time.

- **📚 Multi-Book Library & Backup System**:
  - Manage multiple books in one library.
  - Create new books from curated starter templates (e.g. *The Cartographer of Shadows* fiction novel template, *The Art of Deep Focus* non-fiction guide template, or Blank Slate).
  - One-click duplicate and delete.
  - **JSON Backup & Restore**: Export all your books as a single JSON file to backup or migrate across computers and browsers.

- **📖 Realistic Reader Preview Mode**:
  - Flip through your book page by page with simulated paperback spreads.
  - Theme toggles: Parchment Cream, Clean White, and Dark Velvet.
  - Interactive Table of Contents drawer.

- **🐙 Open Source & GitHub Redirection**:
  - Prominent one-click redirection button directly in the header to view the source code on [GitHub](https://github.com/auroraossoftware/BookMaker).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/auroraossoftware/BookMaker.git
cd BookMaker

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your web browser.

### Production Build

```bash
npm run build
npm run preview
```

The production artifacts will be generated in `dist/`.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS, Custom Literary Fonts (Cinzel, Playfair Display, Merriweather, Inter)
- **PDF Engine**: Client-side `jspdf` vector document builder & print CSS
- **Icons**: `lucide-react`
- **Effects**: `canvas-confetti`
- **Build Tool**: Vite 5

---

## 🔒 Privacy & Architecture

BookMaker does not communicate with any external backend API, analytical tracker, or database. Every keystroke is saved locally in your browser's persistent storage. If you want to transfer your manuscripts or keep long-term backups, use the **Export Backup** feature in the Library to download a `.json` archive.

---

## 📄 License

MIT © [BookMaker Contributors](https://github.com/auroraossoftware/BookMaker)
