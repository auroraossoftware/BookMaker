import React, { useState, useRef } from 'react';
import { Chapter, BookSettings } from '../types/book';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  Minus,
  List,
  ListOrdered,
  Eye,
  PenTool,
  Maximize2,
  Minimize2,
  StickyNote,
  Clock,
} from 'lucide-react';

interface EditorProps {
  chapter: Chapter;
  onUpdateChapter: (updated: Partial<Chapter>) => void;
  settings: BookSettings;
  onUpdateSettings: (settings: Partial<BookSettings>) => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  chapter,
  onUpdateChapter,
  settings,
  onUpdateSettings,
  isZenMode,
  onToggleZenMode,
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = chapter.content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = chapter.content.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Helper to insert formatting at cursor
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onUpdateChapter({ content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertFormatting('**', '**');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertFormatting('*', '*');
    }
  };

  const fontClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono',
    display: 'font-["Playfair_Display"]',
  }[settings.defaultFont] || 'font-serif';

  return (
    <div className={`flex-1 flex flex-col h-full bg-stone-50 dark:bg-stone-900 transition-colors ${isZenMode ? 'p-2 md:p-6' : 'p-4 md:p-6'}`}>
      {/* Editor Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        {/* Formatting Actions */}
        <div className="flex items-center gap-1 bg-white dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-x-auto">
          <button
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-stone-200 dark:bg-stone-700 mx-0.5" />
          <button
            onClick={() => insertFormatting('## ')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Section Heading"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('### ')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Subheading"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('> ')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('\n\n* * *\n\n')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Scene Break Divider"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('- ')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Bullet list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('1. ')}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Right side controls: Font, Preview toggle, Notes, Zen */}
        <div className="flex items-center gap-2">
          {/* Font Selector */}
          <select
            value={settings.defaultFont}
            onChange={e => onUpdateSettings({ defaultFont: e.target.value as any })}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300"
          >
            <option value="serif">Merriweather (Serif)</option>
            <option value="sans">Inter (Modern Sans)</option>
            <option value="display">Playfair (Display)</option>
            <option value="mono">Fira Code (Mono)</option>
          </select>

          {/* Font Size decrease / increase */}
          <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-800 text-xs">
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.max(14, settings.fontSize - 1) })}
              className="px-2 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-l-xl"
              title="Decrease text size"
            >
              -
            </button>
            <span className="px-1.5 text-stone-500 font-mono text-[11px]">{settings.fontSize}</span>
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.min(26, settings.fontSize + 1) })}
              className="px-2 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-r-xl"
              title="Increase text size"
            >
              +
            </button>
          </div>

          {/* Preview / Write Toggle */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition ${
              previewMode
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300'
            }`}
          >
            {previewMode ? <PenTool className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{previewMode ? 'Edit Mode' : 'Preview'}</span>
          </button>

          {/* Chapter Notes toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`p-1.5 rounded-xl border transition ${
              showNotes
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300'
            }`}
            title="Chapter Research & Character Notes"
          >
            <StickyNote className="w-4 h-4" />
          </button>

          {/* Zen Mode */}
          <button
            onClick={onToggleZenMode}
            className={`p-1.5 rounded-xl border transition ${
              isZenMode
                ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-300'
            }`}
            title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Distraction-Free Mode'}
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Chapter Metadata Header */}
      <div className="py-4 border-b border-stone-200/80 dark:border-stone-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 space-y-1">
          <input
            type="text"
            value={chapter.title}
            onChange={e => onUpdateChapter({ title: e.target.value })}
            placeholder="Chapter Title..."
            className="w-full text-xl md:text-2xl font-bold bg-transparent border-0 p-0 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-0 placeholder:text-stone-400 font-['Playfair_Display']"
          />
          <input
            type="text"
            value={chapter.subtitle || ''}
            onChange={e => onUpdateChapter({ subtitle: e.target.value })}
            placeholder="Add an optional chapter subtitle or date..."
            className="w-full text-xs italic bg-transparent border-0 p-0 text-stone-500 dark:text-stone-400 focus:outline-none focus:ring-0 placeholder:text-stone-400"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={chapter.status}
            onChange={e => onUpdateChapter({ status: e.target.value as any })}
            className="text-xs font-medium px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-sm"
          >
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Drafting Canvas & Notes Layout */}
      <div className="flex-1 flex overflow-hidden pt-4 gap-4">
        {/* Manuscript Editor Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {previewMode ? (
            /* Rendered Markdown Preview */
            <div
              className={`flex-1 p-6 md:p-10 rounded-2xl bg-white dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 shadow-sm max-w-3xl mx-auto w-full overflow-y-auto ${fontClass}`}
              style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineHeight }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">{chapter.title}</h1>
                {chapter.subtitle && <p className="text-sm italic opacity-70 mt-1">{chapter.subtitle}</p>}
                <div className="text-xs opacity-40 mt-3">~ ❦ ~</div>
              </div>

              {chapter.content.split(/\n\s*\n/).map((para, idx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                if (trimmed === '* * *' || trimmed === '---' || trimmed === '***') {
                  return (
                    <div key={idx} className="text-center my-6 opacity-40 text-xs tracking-widest">
                      ✦   ✦   ✦
                    </div>
                  );
                }

                if (trimmed.startsWith('>')) {
                  return (
                    <blockquote key={idx} className="border-l-4 border-indigo-400 pl-4 py-1 italic opacity-85 my-4">
                      {trimmed.replace(/^>\s*/, '')}
                    </blockquote>
                  );
                }

                if (trimmed.startsWith('#')) {
                  return (
                    <h2 key={idx} className="text-xl font-bold mt-6 mb-2">
                      {trimmed.replace(/^#+\s*/, '')}
                    </h2>
                  );
                }

                return (
                  <p key={idx} className="mb-4 text-justify leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ) : (
            /* Textarea Writing Surface */
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
              <textarea
                ref={textareaRef}
                value={chapter.content}
                onChange={e => onUpdateChapter({ content: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder="Begin writing your chapter here... Let your creativity flow. All changes are saved directly into your browser in real-time."
                className={`flex-1 w-full bg-white dark:bg-stone-950/70 p-6 md:p-10 rounded-2xl border border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 resize-none shadow-sm ${fontClass} leading-relaxed`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
              />
            </div>
          )}
        </div>

        {/* Chapter Research / Author Notes Drawer */}
        {showNotes && (
          <div className="w-80 rounded-2xl bg-amber-50/70 dark:bg-stone-900/90 border border-amber-200 dark:border-stone-800 p-4 flex flex-col shadow-lg animate-fade-in shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                  Chapter Notes & Ideas
                </h4>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-stone-400 my-2">
              Private scratchpad for outlines, character motivations, and plot points for this chapter.
            </p>
            <textarea
              value={chapter.notes || ''}
              onChange={e => onUpdateChapter({ notes: e.target.value })}
              placeholder="Jot down scene goals, character names, or unpolished ideas..."
              className="flex-1 w-full p-3 rounded-xl border border-amber-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-800 dark:text-stone-200 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="pt-3 mt-2 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-4">
          <span className="font-medium text-stone-700 dark:text-stone-300">
            {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
          </span>
          <span>•</span>
          <span>{charCount.toLocaleString()} chars</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            ~{readingTimeMin} min read
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Auto-saved to browser</span>
        </div>
      </div>
    </div>
  );
};
