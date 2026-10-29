import React from 'react';
import { Book, CoverStyle, CoverEmblem } from '../types/book';
import { X, Palette, Sparkles, Feather, BookOpen, Star, Crown, Compass, Trees, Ban, Check } from 'lucide-react';

interface CoverDesignerModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCover: Book['cover']) => void;
}

const COLOR_PALETTES = [
  { name: 'Midnight & Gold', primary: '#0f172a', secondary: '#f59e0b', text: '#ffffff' },
  { name: 'Imperial Crimson', primary: '#450a0a', secondary: '#fbbf24', text: '#fef2f2' },
  { name: 'Emerald Classic', primary: '#064e3b', secondary: '#34d399', text: '#f0fdf4' },
  { name: 'Parchment & Sepia', primary: '#292524', secondary: '#d97706', text: '#fef3c7' },
  { name: 'Deep Amethyst', primary: '#3b0764', secondary: '#c084fc', text: '#faf5ff' },
  { name: 'Dark Slate & Cyan', primary: '#1e293b', secondary: '#38bdf8', text: '#ffffff' },
  { name: 'Monochrome Noir', primary: '#171717', secondary: '#e5e5e5', text: '#fafafa' },
  { name: 'Terracotta Rust', primary: '#7c2d12', secondary: '#fdba74', text: '#fff7ed' },
];

const STYLES: { id: CoverStyle; label: string; desc: string }[] = [
  { id: 'vintage', label: 'Vintage Leather', desc: 'Ornate double borders and traditional serif typography' },
  { id: 'classic', label: 'Classic Literary', desc: 'Timeless balanced frame with author emblem' },
  { id: 'modern', label: 'Modern Minimal', desc: 'Clean geometric lines with bold typography' },
  { id: 'bold', label: 'Bold Impact', desc: 'High contrast display title with dramatic accents' },
  { id: 'fantasy', label: 'Fantasy & Myth', desc: 'Mystical corner emblems and decorative stars' },
];

const EMBLEMS: { id: CoverEmblem; label: string; icon: React.ReactNode }[] = [
  { id: 'compass', label: 'Compass', icon: <Compass className="w-5 h-5" /> },
  { id: 'feather', label: 'Quill Feather', icon: <Feather className="w-5 h-5" /> },
  { id: 'book', label: 'Open Book', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'star', label: 'Guiding Star', icon: <Star className="w-5 h-5" /> },
  { id: 'crown', label: 'Royal Crown', icon: <Crown className="w-5 h-5" /> },
  { id: 'tree', label: 'Ancient Tree', icon: <Trees className="w-5 h-5" /> },
  { id: 'none', label: 'None', icon: <Ban className="w-5 h-5" /> },
];

export const CoverDesignerModal: React.FC<CoverDesignerModalProps> = ({
  book,
  isOpen,
  onClose,
  onSave,
}) => {
  const [cover, setCover] = React.useState<Book['cover']>(book.cover);

  React.useEffect(() => {
    setCover(book.cover);
  }, [book.cover, isOpen]);

  if (!isOpen) return null;

  const handlePaletteSelect = (palette: typeof COLOR_PALETTES[0]) => {
    setCover(prev => ({
      ...prev,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      textColor: palette.text,
    }));
  };

  const handleApply = () => {
    onSave(cover);
    onClose();
  };

  const renderEmblemIcon = (emblem: CoverEmblem, size = 'w-8 h-8') => {
    switch (emblem) {
      case 'compass': return <Compass className={size} />;
      case 'feather': return <Feather className={size} />;
      case 'book': return <BookOpen className={size} />;
      case 'star': return <Star className={size} />;
      case 'crown': return <Crown className={size} />;
      case 'tree': return <Trees className={size} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Cover Designer</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Design an eye-catching book cover rendered in your exports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Interactive Preview */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="text-xs font-semibold tracking-wider text-stone-500 uppercase mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Live 3D Cover Preview
            </div>

            {/* 3D Book Cover Mockup */}
            <div
              className="relative w-64 h-96 rounded-r-xl rounded-l-sm shadow-2xl flex flex-col justify-between p-6 transition-all duration-300 transform hover:scale-[1.02] border-l-4 border-black/30 overflow-hidden"
              style={{
                backgroundColor: cover.primaryColor,
                color: cover.textColor,
                boxShadow: '8px 12px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset',
              }}
            >
              {/* Inner Decorative Border */}
              <div
                className="absolute inset-3 border pointer-events-none rounded transition-all"
                style={{
                  borderColor: cover.secondaryColor,
                  borderWidth: cover.style === 'vintage' ? '2px' : '1px',
                  borderStyle: cover.style === 'vintage' ? 'double' : 'solid',
                }}
              />

              {/* Spine shading overlay */}
              <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/10 to-transparent pointer-events-none" />

              {/* Top Section: Emblem */}
              <div className="relative z-10 flex flex-col items-center mt-3" style={{ color: cover.secondaryColor }}>
                {renderEmblemIcon(cover.emblem, 'w-8 h-8')}
                <div className="text-[10px] tracking-widest uppercase opacity-75 mt-1 font-mono">
                  {book.genre || 'Edition'}
                </div>
              </div>

              {/* Middle Section: Title & Subtitle */}
              <div className="relative z-10 text-center my-auto px-2">
                <h1
                  className={`text-xl font-bold uppercase tracking-wider leading-snug drop-shadow-sm ${
                    cover.titleFont === 'cinzel'
                      ? 'font-["Cinzel"]'
                      : cover.titleFont === 'display'
                      ? 'font-["Playfair_Display"]'
                      : cover.titleFont === 'serif'
                      ? 'font-serif'
                      : 'font-sans'
                  }`}
                  style={{ color: cover.textColor }}
                >
                  {book.title || 'Untitled Book'}
                </h1>
                {book.subtitle && (
                  <p
                    className="text-xs italic mt-2 opacity-85 leading-tight"
                    style={{ color: cover.secondaryColor }}
                  >
                    {book.subtitle}
                  </p>
                )}
              </div>

              {/* Bottom Section: Author & Imprint */}
              <div className="relative z-10 text-center mb-2">
                <div
                  className="h-[1px] w-12 mx-auto mb-2 opacity-50"
                  style={{ backgroundColor: cover.secondaryColor }}
                />
                <p
                  className="text-xs font-medium tracking-widest uppercase"
                  style={{ color: cover.secondaryColor }}
                >
                  {book.author || 'Author Name'}
                </p>
                <p className="text-[8px] tracking-widest text-white/50 uppercase mt-1">BookMaker Edition</p>
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="md:col-span-7 space-y-6">
            {/* Color Palettes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2.5">
                Color Palette Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {COLOR_PALETTES.map(p => {
                  const isSelected = cover.primaryColor === p.primary && cover.secondaryColor === p.secondary;
                  return (
                    <button
                      key={p.name}
                      onClick={() => handlePaletteSelect(p)}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/30'
                          : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: p.primary }} />
                        <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: p.secondary }} />
                      </div>
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300 truncate">
                        {p.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Primary & Accent Color Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  Primary Book Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cover.primaryColor}
                    onChange={e => setCover({ ...cover, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={cover.primaryColor}
                    onChange={e => setCover({ ...cover, primaryColor: e.target.value })}
                    className="flex-1 text-xs font-mono px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 uppercase"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 dark:text-stone-400 block mb-1">
                  Accent & Trim Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={cover.secondaryColor}
                    onChange={e => setCover({ ...cover, secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={cover.secondaryColor}
                    onChange={e => setCover({ ...cover, secondaryColor: e.target.value })}
                    className="flex-1 text-xs font-mono px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Emblem Chooser */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2.5">
                Front Cover Emblem
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {EMBLEMS.map(e => {
                  const active = cover.emblem === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => setCover({ ...cover, emblem: e.id })}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition ${
                        active
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                      }`}
                      title={e.label}
                    >
                      {e.icon}
                      <span className="text-[10px] mt-1 truncate max-w-full">{e.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography Choice */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                  Title Font
                </label>
                <select
                  value={cover.titleFont}
                  onChange={e => setCover({ ...cover, titleFont: e.target.value as any })}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="cinzel">Cinzel (Classical & Epic)</option>
                  <option value="display">Playfair Display (Literary)</option>
                  <option value="serif">Merriweather Serif</option>
                  <option value="sans">Modern Sans-Serif</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                  Frame Style
                </label>
                <select
                  value={cover.style}
                  onChange={e => setCover({ ...cover, style: e.target.value as any })}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {STYLES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3 bg-stone-50 dark:bg-stone-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-2 transition"
          >
            <Check className="w-4 h-4" />
            Save Cover Design
          </button>
        </div>
      </div>
    </div>
  );
};
