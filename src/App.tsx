import { useState, useEffect, useCallback } from 'react';
import { Book, Chapter, BookSettings, StorageStatus } from './types/book';
import { storage } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { PdfExportModal } from './components/PdfExportModal';
import { PreviewReaderModal } from './components/PreviewReaderModal';
import { CoverDesignerModal } from './components/CoverDesignerModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { LibraryModal } from './components/LibraryModal';
import { AboutModal } from './components/AboutModal';
import { PrintBookLayout } from './components/PrintBookLayout';

export function App() {
  const [book, setBook] = useState<Book>(() => storage.getActiveBook());
  const [activeChapterId, setActiveChapterId] = useState<string>(
    () => book.chapters[0]?.id || ''
  );
  const [storageStatus, setStorageStatus] = useState<StorageStatus>(() => storage.getStatus());
  const [theme, setTheme] = useState<'light' | 'dark' | 'parchment'>(() => storage.getStoredTheme());
  const [isZenMode, setIsZenMode] = useState(false);

  // Modals state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Subscribe to storage updates
  useEffect(() => {
    const unsub = storage.subscribe(status => {
      setStorageStatus(status);
    });
    return unsub;
  }, []);

  // Sync theme to document element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    document.body.classList.remove('theme-parchment');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'parchment') {
      document.body.classList.add('theme-parchment');
    }
    storage.setStoredTheme(theme);
  }, [theme]);

  // Handle active chapter fallback
  useEffect(() => {
    if (!book.chapters.find(c => c.id === activeChapterId)) {
      setActiveChapterId(book.chapters[0]?.id || '');
    }
  }, [book.chapters, activeChapterId]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        storage.saveBookImmediate(book);
      } else if (e.key === 'Escape' && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, isZenMode]);

  // Update whole book helper with debounced auto-save
  const updateBook = useCallback((updated: Book, immediate = false) => {
    setBook(updated);
    if (immediate) {
      storage.saveBookImmediate(updated);
    } else {
      storage.saveBookDebounced(updated);
    }
  }, []);

  // Chapter operations
  const activeChapter = book.chapters.find(c => c.id === activeChapterId) || book.chapters[0];

  const handleUpdateChapter = (fields: Partial<Chapter>) => {
    if (!activeChapter) return;
    const now = Date.now();
    const updatedChapters = book.chapters.map(c =>
      c.id === activeChapter.id ? { ...c, ...fields, updatedAt: now } : c
    );
    updateBook({ ...book, chapters: updatedChapters, updatedAt: now });
  };

  const handleAddChapter = () => {
    const now = Date.now();
    const newChapNum = book.chapters.length + 1;
    const newChapter: Chapter = {
      id: `ch-${now}-${Math.random().toString(36).slice(2, 6)}`,
      title: `Chapter ${newChapNum}`,
      subtitle: '',
      content: '',
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };
    const updatedChapters = [...book.chapters, newChapter];
    updateBook({ ...book, chapters: updatedChapters, updatedAt: now }, true);
    setActiveChapterId(newChapter.id);
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (book.chapters.length <= 1) return;
    const now = Date.now();
    const updatedChapters = book.chapters.filter(c => c.id !== chapterId);
    updateBook({ ...book, chapters: updatedChapters, updatedAt: now }, true);
    if (activeChapterId === chapterId) {
      setActiveChapterId(updatedChapters[0]?.id || '');
    }
  };

  const handleDuplicateChapter = (chapterId: string) => {
    const source = book.chapters.find(c => c.id === chapterId);
    if (!source) return;
    const now = Date.now();
    const index = book.chapters.findIndex(c => c.id === chapterId);

    const duplicate: Chapter = {
      ...source,
      id: `ch-${now}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${source.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...book.chapters];
    updated.splice(index + 1, 0, duplicate);
    updateBook({ ...book, chapters: updated, updatedAt: now }, true);
    setActiveChapterId(duplicate.id);
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= book.chapters.length) return;

    const updated = [...book.chapters];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    updateBook({ ...book, chapters: updated, updatedAt: Date.now() }, true);
  };

  const handleUpdateSettings = (settingsFields: Partial<BookSettings>) => {
    updateBook({
      ...book,
      settings: { ...book.settings, ...settingsFields },
    });
  };

  const handleSaveCover = (cover: Book['cover']) => {
    updateBook({ ...book, cover }, true);
  };

  const handleSaveDetails = (details: Partial<Book>) => {
    updateBook({ ...book, ...details }, true);
  };

  const handleSelectBook = (selectedBook: Book) => {
    setBook(selectedBook);
    setActiveChapterId(selectedBook.chapters[0]?.id || '');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar (Hidden in Zen Mode for pure focus) */}
      {!isZenMode && (
        <Navbar
          book={book}
          storageStatus={storageStatus}
          theme={theme}
          onThemeChange={setTheme}
          onOpenPdfModal={() => setIsPdfModalOpen(true)}
          onOpenPreviewModal={() => setIsPreviewModalOpen(true)}
          onOpenLibraryModal={() => setIsLibraryModalOpen(true)}
          onOpenAboutModal={() => setIsAboutModalOpen(true)}
          isZenMode={isZenMode}
          onToggleZenMode={() => setIsZenMode(!isZenMode)}
        />
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Hidden in Zen Mode) */}
        {!isZenMode && (
          <Sidebar
            book={book}
            activeChapterId={activeChapterId}
            onSelectChapter={setActiveChapterId}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onMoveChapter={handleMoveChapter}
            onOpenCoverDesigner={() => setIsCoverModalOpen(true)}
            onOpenBookDetails={() => setIsDetailsModalOpen(true)}
            onDuplicateChapter={handleDuplicateChapter}
          />
        )}

        {/* Editor Writing Surface */}
        {activeChapter ? (
          <Editor
            chapter={activeChapter}
            onUpdateChapter={handleUpdateChapter}
            settings={book.settings}
            onUpdateSettings={handleUpdateSettings}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode(!isZenMode)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400">
            No chapter selected.
          </div>
        )}
      </div>

      {/* Modals */}
      <PdfExportModal
        book={book}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      <PreviewReaderModal
        book={book}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
      />

      <CoverDesignerModal
        book={book}
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        onSave={handleSaveCover}
      />

      <BookDetailsModal
        book={book}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onSave={handleSaveDetails}
      />

      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        activeBookId={book.id}
        onSelectBook={handleSelectBook}
        storageStatus={storageStatus}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Hidden Vector Print Layout for high-res browser PDF export */}
      <PrintBookLayout book={book} />
    </div>
  );
}

export default App;
