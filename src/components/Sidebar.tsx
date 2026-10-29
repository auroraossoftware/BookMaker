import React, { useState } from 'react';
import { Book } from '../types/book';
import {
  Plus,
  Search,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Palette,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  book: Book;
  activeChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  onAddChapter: () => void;
  onDeleteChapter: (chapterId: string) => void;
  onMoveChapter: (index: number, direction: 'up' | 'down') => void;
  onOpenCoverDesigner: () => void;
  onOpenBookDetails: () => void;
  onDuplicateChapter: (chapterId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  book,
  activeChapterId,
  onSelectChapter,
  onAddChapter,
  onDeleteChapter,
  onMoveChapter,
  onOpenCoverDesigner,
  onOpenBookDetails,
  onDuplicateChapter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = book.chapters.filter(ch =>
    ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (ch.subtitle && ch.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalWords = book.chapters.reduce((acc, ch) => {
    return acc + ch.content.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  const estReadHours = (totalWords / (200 * 60)).toFixed(1);

  return (
    <aside className="w-80 h-full border-r border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur flex flex-col shrink-0 select-none">
      {/* Book Summary Card */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-start gap-3">
          {/* Mini 3D Book Cover */}
          <div
            onClick={onOpenCoverDesigner}
            className="w-12 h-16 rounded-md shadow-md shrink-0 flex flex-col justify-between p-1 text-center cursor-pointer transform hover:scale-105 transition border-l-2 border-black/30"
            style={{
              backgroundColor: book.cover.primaryColor,
              color: book.cover.textColor,
            }}
            title="Click to customize book cover"
          >
            <div className="text-[6px]" style={{ color: book.cover.secondaryColor }}>✦</div>
            <div className="text-[7px] font-bold uppercase truncate px-0.5">{book.title.slice(0, 10)}</div>
            <div className="text-[5px] truncate opacity-70">{book.author.slice(0, 10)}</div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate" title={book.title}>
              {book.title || 'Untitled Book'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
              by {book.author || 'Anonymous'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={onOpenCoverDesigner}
                className="text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <Palette className="w-3 h-3" />
                Cover
              </button>
              <span className="text-stone-300 dark:text-stone-700">•</span>
              <button
                onClick={onOpenBookDetails}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Header & Search */}
      <div className="p-3 border-b border-stone-200 dark:border-stone-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Chapters ({book.chapters.length})
          </span>
          <button
            onClick={onAddChapter}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search chapters..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredChapters.map(chap => {
          const isActive = chap.id === activeChapterId;
          const words = chap.content.trim().split(/\s+/).filter(Boolean).length;
          const originalIndex = book.chapters.findIndex(c => c.id === chap.id);

          return (
            <div
              key={chap.id}
              onClick={() => onSelectChapter(chap.id)}
              className={`group p-2.5 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 shadow-sm'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-800/60 text-stone-700 dark:text-stone-300 border border-transparent'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-stone-400 font-semibold">
                    {originalIndex + 1}.
                  </span>
                  <span className="text-xs font-semibold truncate">
                    {chap.title || `Chapter ${originalIndex + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-400 dark:text-stone-500">
                  <span>{words.toLocaleString()} words</span>
                  <span>•</span>
                  <span className={`capitalize font-medium ${
                    chap.status === 'completed'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : chap.status === 'in_progress'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-stone-400'
                  }`}>
                    {chap.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Reorder and Chapter Actions (on hover) */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                <button
                  disabled={originalIndex === 0}
                  onClick={e => { e.stopPropagation(); onMoveChapter(originalIndex, 'up'); }}
                  className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={originalIndex === book.chapters.length - 1}
                  onClick={e => { e.stopPropagation(); onMoveChapter(originalIndex, 'down'); }}
                  className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onDuplicateChapter(chap.id); }}
                  className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  title="Duplicate chapter"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {book.chapters.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteChapter(chap.id); }}
                    className="p-1 rounded text-stone-400 hover:text-rose-600 dark:hover:text-rose-400"
                    title="Delete chapter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Statistics Footer */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
        <div>
          <span className="font-semibold text-stone-700 dark:text-stone-300">{totalWords.toLocaleString()}</span> total words
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-stone-400" />
          <span>~{estReadHours}h read</span>
        </div>
      </div>
    </aside>
  );
};
