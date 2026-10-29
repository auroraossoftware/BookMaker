import React, { useState } from 'react';
import { Book, PdfExportOptions } from '../types/book';
import { generateBookPdf, defaultPdfOptions } from '../services/pdfGenerator';
import { downloadBlob, exportBookAsMarkdown, exportBookAsText } from '../services/exportUtils';
import confetti from 'canvas-confetti';
import {
  X,
  FileDown,
  Printer,
  FileText,
  CheckCircle2,
  Loader2,
  Settings2,
  SlidersHorizontal,
} from 'lucide-react';

interface PdfExportModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  book,
  isOpen,
  onClose,
}) => {
  const [options, setOptions] = useState<PdfExportOptions>(defaultPdfOptions);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      // Yield thread briefly for smooth UI feedback
      await new Promise(r => setTimeout(r, 120));
      const blob = await generateBookPdf(book, options);

      const safeTitle = (book.title || 'book')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
      downloadBlob(blob, `${safeTitle}.pdf`);

      setIsGenerating(false);
      setDownloadSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#eab308', '#10b981', '#ec4899'],
      });

      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsGenerating(false);
      alert('Could not compile PDF. Please check your browser console.');
    }
  };

  const handleBrowserPrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const totalWords = book.chapters.reduce((acc, c) => {
    return acc + c.content.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  const estimatedPages = Math.max(
    1,
    Math.round(totalWords / 250) + (options.includeCover ? 1 : 0) + (options.includeToc ? 1 : 0) + 1
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Export Locally as PDF</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Compile your complete book into an elegant, printable PDF saved straight to your computer
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Stats Pill */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-center">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Chapters</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100">{book.chapters.length}</div>
            </div>
            <div className="border-x border-stone-200 dark:border-stone-700">
              <div className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Word Count</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100">{totalWords.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Est. Book Pages</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100">~{estimatedPages}</div>
            </div>
          </div>

          {/* Book Format & Size */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-2.5 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              Book Page Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'trade', label: '6" × 9" Trade', sub: 'Standard Paperback' },
                { id: 'a5', label: 'A5 Digest', sub: '148 × 210 mm' },
                { id: 'a4', label: 'A4 Manuscript', sub: '210 × 297 mm' },
                { id: 'letter', label: 'US Letter', sub: '8.5" × 11"' },
              ].map(f => {
                const isSelected = options.pageSize === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setOptions({ ...options, pageSize: f.id as any })}
                    className={`p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                    }`}
                  >
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">{f.label}</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{f.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography & Font Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1.5">
                Font Typography
              </label>
              <select
                value={options.fontFamily}
                onChange={e => setOptions({ ...options, fontFamily: e.target.value as any })}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="serif">Classic Serif (Times / Merriweather)</option>
                <option value="sans">Clean Sans-Serif (Helvetica / Modern)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1.5">
                Body Font Size
              </label>
              <select
                value={options.fontSize}
                onChange={e => setOptions({ ...options, fontSize: Number(e.target.value) })}
                className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value={10}>10 pt (Dense / Pocket)</option>
                <option value={11}>11 pt (Standard Publishing Standard)</option>
                <option value={12}>12 pt (Comfortable Reading)</option>
                <option value={13}>13 pt (Large Print)</option>
              </select>
            </div>
          </div>

          {/* Book Components Inclusion Toggles */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-2.5 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-indigo-500" />
              Included Elements in PDF
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'includeCover', label: 'Book Cover Page', desc: 'Full-color front cover with title and author' },
                { id: 'includeTitlePage', label: 'Half-Title & Title Page', desc: 'Formal interior title leaf' },
                { id: 'includeDedication', label: 'Dedication & Copyright', desc: 'Frontmatter legal and dedication text' },
                { id: 'includeToc', label: 'Table of Contents', desc: 'Dynamic chapter list with page dot leaders' },
                { id: 'pageNumbering', label: 'Running Page Numbers', desc: 'Centered page numbers in footer' },
                { id: 'headerTitle', label: 'Running Header', desc: 'Alternating book and chapter headers' },
              ].map(item => {
                const checked = (options as any)[item.id];
                return (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => setOptions({ ...options, [item.id]: e.target.checked })}
                      className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">{item.label}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">{item.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Additional Local Export Formats */}
          <div className="pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Alternative Local Formats
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => exportBookAsMarkdown(book)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Export as Markdown (.md)
              </button>
              <button
                type="button"
                onClick={() => exportBookAsText(book)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5 text-stone-500" />
                Export as Plain Text (.txt)
              </button>
            </div>
          </div>

          {/* Success banner */}
          {downloadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Your PDF was generated successfully and downloaded to your local computer!</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900/50">
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center gap-2 transition"
            title="Opens system print dialog with browser high-res vector rendering"
          >
            <Printer className="w-4 h-4" />
            Print to PDF via Browser
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Cancel
            </button>
            <button
              disabled={isGenerating}
              onClick={handleGeneratePdf}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Compiling PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Download PDF Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
