import React from 'react';
import { Book, StorageStatus } from '../types/book';
import {
  BookOpen,
  FileDown,
  Github,
  Library,
  Sun,
  Moon,
  Coffee,
  ExternalLink,
  Info,
} from 'lucide-react';

interface NavbarProps {
  book: Book;
  storageStatus?: StorageStatus;
  theme: 'light' | 'dark' | 'parchment';
  onThemeChange: (theme: 'light' | 'dark' | 'parchment') => void;
  onOpenPdfModal: () => void;
  onOpenPreviewModal: () => void;
  onOpenLibraryModal: () => void;
  onOpenAboutModal: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  book,
  theme,
  onThemeChange,
  onOpenPdfModal,
  onOpenPreviewModal,
  onOpenLibraryModal,
  onOpenAboutModal,
}) => {
  const githubRepoUrl = 'https://github.com/auroraossoftware/BookMaker';

  return (
    <header className="h-16 px-4 md:px-6 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-between shrink-0 select-none z-30">
      {/* Brand & Active Book */}
      <div className="flex items-center gap-4">
        <div
          onClick={onOpenAboutModal}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="About BookMaker"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-stone-100 font-['Cinzel']">
                BookMaker
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
                Studio
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:block h-5 w-px bg-stone-200 dark:border-stone-800" />

        {/* Quick Book Title & Library Dropdown Trigger */}
        <button
          onClick={onOpenLibraryModal}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition max-w-[200px] md:max-w-[280px]"
          title="Switch book or open library"
        >
          <Library className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
            {book.title || 'Untitled Book'}
          </span>
        </button>

        {/* Background Storage Status Indicator */}
        <div
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px]"
          title="All chapters, covers, and details are auto-saved directly in your browser's persistent storage without signup"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">In-Browser Storage Active</span>
          <span className="text-emerald-500/60">•</span>
          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">No Signup</span>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Preview Book Button */}
        <button
          onClick={onOpenPreviewModal}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition"
          title="Preview reading experience"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden md:inline">Preview Book</span>
        </button>

        {/* PDF Export Button (Prominent) */}
        <button
          onClick={onOpenPdfModal}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-amber-600 to-indigo-600 hover:opacity-95 shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition transform hover:scale-[1.02]"
          title="Compile and save work locally as PDF"
        >
          <FileDown className="w-4 h-4" />
          <span>Save as PDF</span>
        </button>

        <div className="h-5 w-px bg-stone-200 dark:border-stone-800 mx-0.5 hidden sm:block" />

        {/* Library Button */}
        <button
          onClick={onOpenLibraryModal}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title="Manage Books & Backups"
        >
          <Library className="w-4 h-4" />
        </button>

        {/* Theme Cycle Toggle */}
        <button
          onClick={() => {
            const nextTheme = theme === 'light' ? 'parchment' : theme === 'parchment' ? 'dark' : 'light';
            onThemeChange(nextTheme);
          }}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        >
          {theme === 'light' ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : theme === 'parchment' ? (
            <Coffee className="w-4 h-4 text-amber-700" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* GitHub Source Code Redirect Link */}
        <a
          href={githubRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 transition shadow-sm group"
          title="Redirect to GitHub repository for complete source code"
        >
          <Github className="w-4 h-4 text-stone-800 dark:text-stone-100 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Source Code</span>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
        </a>

        {/* About Modal */}
        <button
          onClick={onOpenAboutModal}
          className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          title="About BookMaker"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
