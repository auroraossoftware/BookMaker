import { Book, StorageStatus } from '../types/book';
import { sampleNovelTemplate } from './templates';

const STORAGE_KEY_BOOKS = 'bookmaker_books_v1';
const STORAGE_KEY_ACTIVE_ID = 'bookmaker_active_book_id_v1';
const STORAGE_KEY_THEME = 'bookmaker_theme_v1';

export class StorageService {
  private static instance: StorageService;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private listeners: ((status: StorageStatus) => void)[] = [];

  private constructor() {
    this.initDefaultData();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private initDefaultData(): void {
    try {
      const existingBooks = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (!existingBooks) {
        const initialBooks: Book[] = [sampleNovelTemplate];
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(initialBooks));
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, sampleNovelTemplate.id);
      }
    } catch (e) {
      console.error('Storage initialization failed:', e);
    }
  }

  public subscribe(callback: (status: StorageStatus) => void): () => void {
    this.listeners.push(callback);
    callback(this.getStatus());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    const status = this.getStatus();
    this.listeners.forEach(l => l(status));
  }

  public getStatus(): StorageStatus {
    const books = this.getAllBooks();
    const totalWords = books.reduce((acc, book) => {
      return acc + book.chapters.reduce((cAcc, chap) => {
        const words = chap.content.trim().split(/\s+/).filter(Boolean).length;
        return cAcc + words;
      }, 0);
    }, 0);

    const raw = localStorage.getItem(STORAGE_KEY_BOOKS) || '';
    const bytes = new Blob([raw]).size;

    return {
      lastSaved: Date.now(),
      isSaving: !!this.saveTimeout,
      bookCount: books.length,
      totalWords,
      estimatedKb: Math.round(bytes / 1024),
    };
  }

  public getAllBooks(): Book[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BOOKS);
      if (!data) return [sampleNovelTemplate];
      return JSON.parse(data) as Book[];
    } catch (e) {
      console.error('Error loading books from storage:', e);
      return [sampleNovelTemplate];
    }
  }

  public getActiveBookId(): string {
    try {
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (activeId) return activeId;
      const books = this.getAllBooks();
      return books[0]?.id || sampleNovelTemplate.id;
    } catch {
      return sampleNovelTemplate.id;
    }
  }

  public setActiveBookId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
      this.notify();
    } catch (e) {
      console.error('Error saving active book id:', e);
    }
  }

  public getActiveBook(): Book {
    const books = this.getAllBooks();
    const activeId = this.getActiveBookId();
    const found = books.find(b => b.id === activeId);
    if (found) return found;
    return books[0] || sampleNovelTemplate;
  }

  public saveBookImmediate(book: Book): void {
    try {
      const books = this.getAllBooks();
      const index = books.findIndex(b => b.id === book.id);
      const updatedBook = { ...book, updatedAt: Date.now() };

      if (index >= 0) {
        books[index] = updatedBook;
      } else {
        books.push(updatedBook);
      }

      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
      this.notify();
    } catch (e) {
      console.error('Failed to save book to localStorage:', e);
    }
  }

  public saveBookDebounced(book: Book, delayMs = 350): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.notify(); // Update isSaving
    this.saveTimeout = setTimeout(() => {
      this.saveBookImmediate(book);
      this.saveTimeout = null;
      this.notify();
    }, delayMs);
  }

  public createBook(newBook: Book): Book {
    const books = this.getAllBooks();
    books.unshift(newBook);
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    this.setActiveBookId(newBook.id);
    this.notify();
    return newBook;
  }

  public deleteBook(id: string): void {
    let books = this.getAllBooks();
    books = books.filter(b => b.id !== id);
    if (books.length === 0) {
      books = [sampleNovelTemplate];
    }
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    if (this.getActiveBookId() === id) {
      this.setActiveBookId(books[0].id);
    } else {
      this.notify();
    }
  }

  public duplicateBook(id: string): Book | null {
    const books = this.getAllBooks();
    const source = books.find(b => b.id === id);
    if (!source) return null;

    const copy: Book = {
      ...source,
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${source.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      chapters: source.chapters.map((ch, idx) => ({
        ...ch,
        id: `ch-${Date.now()}-${idx}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })),
    };

    return this.createBook(copy);
  }

  public exportBackupJson(): string {
    const books = this.getAllBooks();
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      appName: 'BookMaker',
      books,
    };
    return JSON.stringify(backup, null, 2);
  }

  public importBackupJson(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const incomingBooks = Array.isArray(parsed.books) ? parsed.books : Array.isArray(parsed) ? parsed : null;

      if (!incomingBooks || incomingBooks.length === 0) {
        return { success: false, count: 0, error: 'No valid books found in file.' };
      }

      // Basic validation
      const validBooks: Book[] = incomingBooks.filter(
        (b: any) => typeof b === 'object' && b.title && Array.isArray(b.chapters)
      );

      if (validBooks.length === 0) {
        return { success: false, count: 0, error: 'Format unrecognized.' };
      }

      const existing = this.getAllBooks();
      const existingIds = new Set(existing.map(b => b.id));

      const merged = [...existing];
      validBooks.forEach(b => {
        if (existingIds.has(b.id)) {
          b.id = `imported-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        }
        merged.unshift(b);
      });

      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(merged));
      this.setActiveBookId(validBooks[0].id);
      this.notify();

      return { success: true, count: validBooks.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Invalid JSON file.' };
    }
  }

  public getStoredTheme(): 'light' | 'dark' | 'parchment' {
    return (localStorage.getItem(STORAGE_KEY_THEME) as any) || 'light';
  }

  public setStoredTheme(theme: 'light' | 'dark' | 'parchment'): void {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }
}

export const storage = StorageService.getInstance();
