import React, { useRef, useState } from 'react';
import { Book, StorageStatus } from '../types/book';
import { storage } from '../services/storage';
import { createBlankBook, sampleNovelTemplate, sampleNonFictionTemplate } from '../services/templates';
import { downloadText } from '../services/exportUtils';
import {
  X,
  BookMarked,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  HardDrive,
  Clock,
  Sparkles,
  BookOpen,
  Check,
  AlertCircle,
} from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBookId: string;
  onSelectBook: (book: Book) => void;
  storageStatus: StorageStatus;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  activeBookId,
  onSelectBook,
  storageStatus,
}) => {
  const [books, setBooks] = useState<Book[]>(storage.getAllBooks());
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const refreshList = () => {
    setBooks(storage.getAllBooks());
  };

  const handleSelect = (book: Book) => {
    storage.setActiveBookId(book.id);
    onSelectBook(book);
    onClose();
  };

  const handleCreateNew = (template: 'blank' | 'novel' | 'nonfiction') => {
    let newBook: Book;
    if (template === 'novel') {
      newBook = {
        ...sampleNovelTemplate,
        id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: 'New Novel Draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else if (template === 'nonfiction') {
      newBook = {
        ...sampleNonFictionTemplate,
        id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: 'New Guide Draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else {
      newBook = createBlankBook('My New Masterpiece', 'Author Name');
    }

    storage.createBook(newBook);
    refreshList();
    onSelectBook(newBook);
    setShowNewMenu(false);
    onClose();
  };

  const handleDuplicate = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    const copy = storage.duplicateBook(bookId);
    if (copy) {
      refreshList();
      setFeedbackMsg({ text: 'Book duplicated successfully.', type: 'success' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleDelete = (e: React.MouseEvent, bookId: string, title: string) => {
    e.stopPropagation();
    if (books.length <= 1) {
      alert('You must have at least one book in your library.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone unless you exported a backup.`)) {
      storage.deleteBook(bookId);
      refreshList();
      const updated = storage.getActiveBook();
      onSelectBook(updated);
    }
  };

  const handleExportBackup = () => {
    const json = storage.exportBackupJson();
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadText(json, `bookmaker-library-backup-${dateStr}.json`, 'application/json');
    setFeedbackMsg({ text: 'Library backup JSON downloaded to your computer!', type: 'success' });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const res = storage.importBackupJson(content);
      if (res.success) {
        refreshList();
        const active = storage.getActiveBook();
        onSelectBook(active);
        setFeedbackMsg({ text: `Successfully restored ${res.count} books!`, type: 'success' });
      } else {
        setFeedbackMsg({ text: res.error || 'Failed to import backup.', type: 'error' });
      }
      setTimeout(() => setFeedbackMsg(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Your Book Library</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Stored in this browser's local memory • {books.length} {books.length === 1 ? 'volume' : 'volumes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {feedbackMsg && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center gap-2 border-b transition ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20'
            }`}
          >
            {feedbackMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Action bar */}
        <div className="px-6 py-3 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="relative">
            <button
              onClick={() => setShowNewMenu(!showNewMenu)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              New Book
            </button>

            {showNewMenu && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 py-1.5 z-20 animate-fade-in">
                <button
                  onClick={() => handleCreateNew('blank')}
                  className="w-full px-4 py-2 text-left text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-stone-400" />
                  Blank Book
                </button>
                <button
                  onClick={() => handleCreateNew('novel')}
                  className="w-full px-4 py-2 text-left text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  Fiction Novel Template
                </button>
                <button
                  onClick={() => handleCreateNew('nonfiction')}
                  className="w-full px-4 py-2 text-left text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2"
                >
                  <BookMarked className="w-3.5 h-3.5 text-cyan-500" />
                  Non-Fiction / Guide Template
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition"
              title="Download all your books into a single JSON backup file"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              Export Backup
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5 transition"
              title="Restore books from a previously saved JSON file"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500" />
              Import Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFileChange}
            />
          </div>
        </div>

        {/* Books List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {books.map(b => {
            const isActive = b.id === activeBookId;
            const words = b.chapters.reduce(
              (acc, c) => acc + c.content.trim().split(/\s+/).filter(Boolean).length,
              0
            );

            return (
              <div
                key={b.id}
                onClick={() => handleSelect(b)}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm ring-1 ring-indigo-500/30'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40'
                }`}
              >
                {/* Book Mini Cover */}
                <div
                  className="w-12 h-16 rounded-md shadow-md shrink-0 flex flex-col justify-between p-1 text-center border-l-2 border-black/20"
                  style={{
                    backgroundColor: b.cover.primaryColor,
                    color: b.cover.textColor,
                  }}
                >
                  <div className="text-[6px] truncate" style={{ color: b.cover.secondaryColor }}>
                    ✦
                  </div>
                  <div className="text-[7px] font-bold uppercase truncate px-0.5">
                    {b.title.slice(0, 10)}
                  </div>
                  <div className="text-[5px] truncate opacity-70">
                    {b.author.slice(0, 10)}
                  </div>
                </div>

                {/* Book Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                      {b.title || 'Untitled Book'}
                    </h3>
                    {isActive && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                    by {b.author || 'Anonymous'} • {b.genre || 'General'}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500 mt-1.5">
                    <span>{b.chapters.length} {b.chapters.length === 1 ? 'chapter' : 'chapters'}</span>
                    <span>•</span>
                    <span>{words.toLocaleString()} words</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {new Date(b.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => handleDuplicate(e, b.id)}
                    className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition"
                    title="Duplicate book"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => handleDelete(e, b.id, b.title)}
                    className="p-2 rounded-lg text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-stone-400" />
            <span>Browser Storage: ~{storageStatus.estimatedKb} KB used</span>
          </div>
          <span>Total Words: {storageStatus.totalWords.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
