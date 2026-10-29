import React, { useState } from 'react';
import { Book } from '../types/book';
import {
  X,
  ChevronLeft,
  ChevronRight,
  List,
  Type,
} from 'lucide-react';

interface PreviewReaderModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewReaderModal: React.FC<PreviewReaderModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  // Page index: 0 = Cover, 1 = Title Page, 2 = Dedication/Copyright, 3+ = Chapters
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [readerTheme, setReaderTheme] = useState<'parchment' | 'white' | 'dark'>('parchment');
  const [fontSize, setFontSize] = useState(17);

  if (!isOpen) return null;

  const totalPages = 3 + book.chapters.length;

  const handleNext = () => {
    if (currentIdx < totalPages - 1) setCurrentIdx(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
  };

  // Theme styles
  const themeStyles = {
    parchment: {
      bg: 'bg-[#fcf9f2] text-[#2c2419]',
      container: 'bg-[#ede5d4]',
      card: 'bg-[#fcf9f2] shadow-2xl border-[#e2d8c0]',
      border: 'border-[#e4dcce]',
    },
    white: {
      bg: 'bg-white text-stone-900',
      container: 'bg-stone-100',
      card: 'bg-white shadow-2xl border-stone-200',
      border: 'border-stone-200',
    },
    dark: {
      bg: 'bg-[#18181b] text-stone-200',
      container: 'bg-[#09090b]',
      card: 'bg-[#18181b] shadow-2xl border-stone-800',
      border: 'border-stone-800',
    },
  }[readerTheme];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Top Controls Bar */}
      <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between text-white shrink-0 bg-stone-900/90">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-lg transition ${
              showToc ? 'bg-white/20 text-white' : 'text-stone-300 hover:bg-white/10'
            }`}
            title="Toggle Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">Reader Preview</span>
            <span className="text-stone-500">•</span>
            <span className="text-xs text-stone-300 truncate max-w-xs">{book.title}</span>
          </div>
        </div>

        {/* Reader Theme & Typography controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setReaderTheme('parchment')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                readerTheme === 'parchment' ? 'bg-[#f7f2e7] text-stone-900 font-semibold shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              Parchment
            </button>
            <button
              onClick={() => setReaderTheme('white')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                readerTheme === 'white' ? 'bg-white text-stone-900 font-semibold shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              White
            </button>
            <button
              onClick={() => setReaderTheme('dark')}
              className={`px-2.5 py-1 text-xs rounded transition ${
                readerTheme === 'dark' ? 'bg-stone-800 text-white font-semibold shadow-sm' : 'text-stone-300 hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1">
            <Type className="w-3.5 h-3.5 text-stone-400" />
            <button
              onClick={() => setFontSize(s => Math.max(14, s - 1))}
              className="px-1 text-xs text-stone-300 hover:text-white"
            >
              A-
            </button>
            <span className="text-xs text-stone-400 px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(s => Math.min(24, s + 1))}
              className="px-1 text-xs text-stone-300 hover:text-white"
            >
              A+
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className={`flex-1 flex overflow-hidden relative ${themeStyles.container}`}>
        {/* TOC Drawer */}
        {showToc && (
          <div className="w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 h-full overflow-y-auto p-4 z-20 shadow-xl animate-fade-in shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Table of Contents</h3>
            <div className="space-y-1">
              <button
                onClick={() => { setCurrentIdx(0); setShowToc(false); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                  currentIdx === 0 ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                Cover Page
              </button>
              <button
                onClick={() => { setCurrentIdx(1); setShowToc(false); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                  currentIdx === 1 ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                Title Page
              </button>
              <button
                onClick={() => { setCurrentIdx(2); setShowToc(false); }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg transition ${
                  currentIdx === 2 ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                Dedication & Copyright
              </button>
              <div className="pt-2 pb-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-3">
                Chapters
              </div>
              {book.chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => { setCurrentIdx(3 + idx); setShowToc(false); }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg truncate transition ${
                    currentIdx === 3 + idx ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-semibold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {idx + 1}. {chap.title || `Chapter ${idx + 1}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book Page Reading Canvas */}
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 md:p-8">
          <div
            className={`w-full max-w-2xl min-h-[640px] md:min-h-[760px] rounded-xl p-8 md:p-14 relative flex flex-col justify-between border ${themeStyles.card}`}
          >
            {/* Page 0: Cover */}
            {currentIdx === 0 && (
              <div
                className="flex-1 flex flex-col justify-between items-center text-center p-8 rounded-lg relative overflow-hidden"
                style={{
                  backgroundColor: book.cover.primaryColor,
                  color: book.cover.textColor,
                }}
              >
                <div
                  className="absolute inset-4 border pointer-events-none rounded"
                  style={{ borderColor: book.cover.secondaryColor }}
                />
                <div className="pt-8 text-sm tracking-widest uppercase" style={{ color: book.cover.secondaryColor }}>
                  ✦  ·  ✦  ·  ✦
                </div>
                <div className="my-auto px-4">
                  <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider font-['Cinzel'] leading-tight">
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="text-sm italic mt-3" style={{ color: book.cover.secondaryColor }}>
                      {book.subtitle}
                    </p>
                  )}
                </div>
                <div className="pb-8">
                  <div className="h-0.5 w-16 mx-auto mb-3" style={{ backgroundColor: book.cover.secondaryColor }} />
                  <p className="text-base font-semibold uppercase tracking-widest" style={{ color: book.cover.secondaryColor }}>
                    {book.author}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 mt-2">BookMaker Edition</p>
                </div>
              </div>
            )}

            {/* Page 1: Title Page */}
            {currentIdx === 1 && (
              <div className="flex-1 flex flex-col justify-between text-center py-12 font-serif">
                <div className="text-xs uppercase tracking-widest opacity-40">BookMaker Literary Edition</div>
                <div className="my-auto">
                  <h1 className="text-3xl font-bold font-['Playfair_Display'] leading-tight">
                    {book.title}
                  </h1>
                  {book.subtitle && (
                    <p className="text-base italic opacity-75 mt-3">{book.subtitle}</p>
                  )}
                  <div className="w-16 h-px bg-current opacity-30 mx-auto my-6" />
                  <p className="text-lg font-medium">{book.author}</p>
                </div>
                <div className="text-xs opacity-50 uppercase tracking-widest">
                  Published in the Browser
                </div>
              </div>
            )}

            {/* Page 2: Dedication & Copyright */}
            {currentIdx === 2 && (
              <div className="flex-1 flex flex-col justify-between py-12 font-serif">
                <div className="my-auto text-center px-6">
                  {book.dedication ? (
                    <div className="text-base italic leading-relaxed opacity-90 max-w-md mx-auto">
                      "{book.dedication}"
                    </div>
                  ) : (
                    <div className="text-xs italic opacity-40">No dedication provided</div>
                  )}

                  {book.foreword && (
                    <div className="mt-8 text-sm italic opacity-75 max-w-sm mx-auto">
                      "{book.foreword}"
                    </div>
                  )}
                </div>

                <div className="text-[11px] opacity-60 leading-relaxed font-sans max-w-md mx-auto text-center">
                  <p>{book.copyright || `© ${new Date().getFullYear()} ${book.author}. All rights reserved.`}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-wider text-stone-400">
                    Compiled and read in BookMaker
                  </p>
                </div>
              </div>
            )}

            {/* Page 3+: Chapters */}
            {currentIdx >= 3 && (() => {
              const chap = book.chapters[currentIdx - 3];
              if (!chap) return null;
              return (
                <div className="flex-1 flex flex-col justify-between font-serif">
                  {/* Running Header */}
                  <div className="text-[11px] uppercase tracking-widest opacity-50 pb-4 border-b border-current/15 flex justify-between">
                    <span>{book.title}</span>
                    <span>{chap.title}</span>
                  </div>

                  {/* Chapter Body */}
                  <div className="my-8 space-y-4 leading-relaxed overflow-y-auto pr-2" style={{ fontSize: `${fontSize}px` }}>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold font-['Playfair_Display']">
                        {chap.title}
                      </h2>
                      {chap.subtitle && (
                        <p className="text-sm italic opacity-75 mt-1">{chap.subtitle}</p>
                      )}
                      <div className="text-xs opacity-40 mt-3">~ ❦ ~</div>
                    </div>

                    {chap.content.split(/\n\s*\n/).map((para, pIdx) => {
                      const trimmed = para.trim();
                      if (!trimmed) return null;

                      if (trimmed === '* * *' || trimmed === '---' || trimmed === '***') {
                        return (
                          <div key={pIdx} className="text-center my-6 opacity-40 text-xs tracking-widest">
                            ✦   ✦   ✦
                          </div>
                        );
                      }

                      if (trimmed.startsWith('>')) {
                        return (
                          <blockquote key={pIdx} className="border-l-2 border-indigo-400/50 pl-4 py-1 italic opacity-85 my-3 text-[0.95em]">
                            {trimmed.replace(/^>\s*/, '')}
                          </blockquote>
                        );
                      }

                      if (trimmed.startsWith('#')) {
                        return (
                          <h3 key={pIdx} className="text-lg font-bold font-['Playfair_Display'] mt-4 mb-2">
                            {trimmed.replace(/^#+\s*/, '')}
                          </h3>
                        );
                      }

                      // First paragraph drop-cap style preview
                      return (
                        <p key={pIdx} className="text-justify leading-relaxed indent-4">
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>

                  {/* Page Footer */}
                  <div className="text-center text-xs opacity-50 pt-4 border-t border-current/15">
                    {currentIdx - 2}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-14 px-6 border-t border-white/10 flex items-center justify-between text-white shrink-0 bg-stone-900/90">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Page
        </button>

        <div className="text-xs text-stone-400 font-mono">
          Page {currentIdx + 1} of {totalPages}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIdx === totalPages - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
        >
          Next Page
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
