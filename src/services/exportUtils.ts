import { Book } from '../types/book';

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadText(content: string, filename: string, mimeType = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

export function exportBookAsMarkdown(book: Book): void {
  let md = `# ${book.title}\n`;
  if (book.subtitle) md += `*${book.subtitle}*\n\n`;
  md += `**Author:** ${book.author}\n\n`;
  if (book.synopsis) md += `## Synopsis\n${book.synopsis}\n\n`;
  if (book.dedication) md += `> *${book.dedication}*\n\n`;
  md += `---\n\n`;

  book.chapters.forEach((chap, idx) => {
    md += `## Chapter ${idx + 1}: ${chap.title}\n`;
    if (chap.subtitle) md += `*${chap.subtitle}*\n\n`;
    md += `${chap.content}\n\n---\n\n`;
  });

  const safeTitle = (book.title || 'book').toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadText(md, `${safeTitle}.md`, 'text/markdown;charset=utf-8');
}

export function exportBookAsText(book: Book): void {
  let txt = `${book.title.toUpperCase()}\n`;
  if (book.subtitle) txt += `${book.subtitle}\n`;
  txt += `By ${book.author}\n\n`;
  txt += `=========================================\n\n`;

  book.chapters.forEach((chap, idx) => {
    txt += `[ CHAPTER ${idx + 1}: ${chap.title.toUpperCase()} ]\n`;
    if (chap.subtitle) txt += `${chap.subtitle}\n`;
    txt += `-----------------------------------------\n\n`;
    txt += `${chap.content}\n\n\n`;
  });

  const safeTitle = (book.title || 'book').toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadText(txt, `${safeTitle}.txt`);
}
