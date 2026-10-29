import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { X, BookCheck, Info, FileText } from 'lucide-react';

interface BookDetailsModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFields: Partial<Book>) => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: book.title,
    subtitle: book.subtitle,
    author: book.author,
    genre: book.genre,
    language: book.language,
    synopsis: book.synopsis,
    dedication: book.dedication,
    copyright: book.copyright,
    foreword: book.foreword,
  });

  useEffect(() => {
    setFormData({
      title: book.title,
      subtitle: book.subtitle,
      author: book.author,
      genre: book.genre,
      language: book.language,
      synopsis: book.synopsis,
      dedication: book.dedication,
      copyright: book.copyright,
      foreword: book.foreword,
    });
  }, [book, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Book Information & Frontmatter</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Metadata, dedication, and copyright details for this volume</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
                Book Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                placeholder="e.g. The Cartographer of Shadows"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
                Author Name *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
                placeholder="e.g. Julian V. Sterling"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
              placeholder="e.g. A Tale of the Edge of the World"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
                Genre / Category
              </label>
              <input
                type="text"
                value={formData.genre}
                onChange={e => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
                placeholder="Fiction, Memoir, Sci-Fi..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={e => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
                placeholder="English, Spanish, French..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
              Synopsis / Blurb
            </label>
            <textarea
              rows={3}
              value={formData.synopsis}
              onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
              placeholder="Brief summary or back-cover teaser for this book..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
              Dedication
            </label>
            <input
              type="text"
              value={formData.dedication}
              onChange={e => setFormData({ ...formData, dedication: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm italic"
              placeholder="e.g. For those who wander uncharted paths..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
                Foreword / Epigraph
              </label>
              <textarea
                rows={2}
                value={formData.foreword}
                onChange={e => setFormData({ ...formData, foreword: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm italic"
                placeholder="Introductory quote or opening epigraph..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1">
                Copyright Notice
              </label>
              <textarea
                rows={2}
                value={formData.copyright}
                onChange={e => setFormData({ ...formData, copyright: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-mono"
                placeholder="© Year Author. All rights reserved."
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>All modifications are stored strictly in your browser storage. Nothing is sent to external servers.</span>
          </div>

          {/* Footer inside form */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-2 transition"
            >
              <BookCheck className="w-4 h-4" />
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
