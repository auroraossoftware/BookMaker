import React from 'react';
import { Book } from '../types/book';

interface PrintBookLayoutProps {
  book: Book;
}

export const PrintBookLayout: React.FC<PrintBookLayoutProps> = ({ book }) => {
  return (
    <div className="print-only hidden font-serif text-black p-0 m-0">
      {/* 1. Print Cover Page */}
      <div className="page-break min-h-screen flex flex-col justify-between items-center text-center p-12 border-4 border-stone-800 m-8">
        <div className="text-xl tracking-widest uppercase pt-12">✦  ·  ✦  ·  ✦</div>
        <div className="my-auto px-6">
          <h1 className="text-4xl font-bold uppercase tracking-wider font-['Cinzel'] leading-tight">
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="text-lg italic mt-4 text-stone-700">{book.subtitle}</p>
          )}
        </div>
        <div className="pb-12">
          <div className="h-0.5 w-24 bg-stone-800 mx-auto mb-4" />
          <p className="text-xl font-semibold tracking-widest uppercase">{book.author}</p>
          <p className="text-xs uppercase tracking-widest text-stone-500 mt-2">BookMaker Edition</p>
        </div>
      </div>

      {/* 2. Half-Title / Title Page */}
      <div className="page-break min-h-screen flex flex-col justify-between items-center text-center py-24">
        <div className="text-xs uppercase tracking-widest text-stone-400">BookMaker Literary Edition</div>
        <div className="my-auto">
          <h1 className="text-3xl font-bold font-['Playfair_Display']">{book.title}</h1>
          {book.subtitle && <p className="text-base italic text-stone-600 mt-2">{book.subtitle}</p>}
          <div className="w-16 h-px bg-stone-300 mx-auto my-6" />
          <p className="text-lg font-medium">{book.author}</p>
        </div>
        <div className="text-xs text-stone-500 uppercase tracking-widest">In-Browser Publication</div>
      </div>

      {/* 3. Dedication & Copyright */}
      <div className="page-break min-h-screen flex flex-col justify-between py-24 px-12">
        <div className="my-auto text-center max-w-md mx-auto">
          {book.dedication && (
            <div className="text-base italic leading-relaxed text-stone-800">
              "{book.dedication}"
            </div>
          )}
          {book.foreword && (
            <div className="mt-8 text-sm italic text-stone-600">
              "{book.foreword}"
            </div>
          )}
        </div>
        <div className="text-xs text-stone-600 text-center max-w-sm mx-auto font-sans">
          <p>{book.copyright || `© ${new Date().getFullYear()} ${book.author}. All rights reserved.`}</p>
        </div>
      </div>

      {/* 4. Table of Contents */}
      <div className="page-break min-h-screen py-20 px-12">
        <h2 className="text-2xl font-bold text-center uppercase tracking-widest mb-12">Table of Contents</h2>
        <div className="max-w-md mx-auto space-y-3 text-sm">
          {book.chapters.map((chap, idx) => (
            <div key={chap.id} className="flex justify-between items-baseline border-b border-dotted border-stone-300 pb-1">
              <span>{chap.title || `Chapter ${idx + 1}`}</span>
              <span className="font-mono text-xs">{idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Chapters */}
      {book.chapters.map((chap, idx) => (
        <div key={chap.id} className="page-break min-h-screen py-16 px-12 leading-relaxed">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-['Playfair_Display']">
              {chap.title || `Chapter ${idx + 1}`}
            </h2>
            {chap.subtitle && (
              <p className="text-sm italic text-stone-600 mt-1">{chap.subtitle}</p>
            )}
            <div className="text-xs text-stone-400 mt-3">~ ❦ ~</div>
          </div>

          <div className="space-y-4 text-justify text-base">
            {chap.content.split(/\n\s*\n/).map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              if (trimmed === '* * *' || trimmed === '---' || trimmed === '***') {
                return (
                  <div key={pIdx} className="text-center my-8 text-stone-500 tracking-widest">
                    ✦   ✦   ✦
                  </div>
                );
              }

              if (trimmed.startsWith('>')) {
                return (
                  <blockquote key={pIdx} className="border-l-2 border-stone-400 pl-4 py-1 italic text-stone-700 my-4">
                    {trimmed.replace(/^>\s*/, '')}
                  </blockquote>
                );
              }

              if (trimmed.startsWith('#')) {
                return (
                  <h3 key={pIdx} className="text-lg font-bold mt-6 mb-2">
                    {trimmed.replace(/^#+\s*/, '')}
                  </h3>
                );
              }

              return (
                <p key={pIdx} className="indent-6">
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
