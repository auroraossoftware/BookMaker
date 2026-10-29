import { jsPDF } from 'jspdf';
import { Book, PdfExportOptions } from '../types/book';

export const defaultPdfOptions: PdfExportOptions = {
  pageSize: 'trade',
  fontFamily: 'serif',
  includeCover: true,
  includeTitlePage: true,
  includeDedication: true,
  includeToc: true,
  pageNumbering: true,
  headerTitle: true,
  fontSize: 11,
  lineSpacing: 1.4,
  chapterPageBreak: true,
};

const PAGE_DIMENSIONS: Record<string, [number, number]> = {
  trade: [152.4, 228.6], // 6 x 9 inches in mm
  a5: [148, 210],
  a4: [210, 297],
  letter: [215.9, 279.4],
};

export const generateBookPdf = async (
  book: Book,
  options: PdfExportOptions = defaultPdfOptions
): Promise<Blob> => {
  const [pageWidth, pageHeight] = PAGE_DIMENSIONS[options.pageSize] || PAGE_DIMENSIONS.trade;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  });

  const font = options.fontFamily === 'serif' ? 'times' : 'helvetica';
  const marginX = options.pageSize === 'trade' || options.pageSize === 'a5' ? 18 : 22;
  const marginTop = 22;
  const marginBottom = 20;
  const contentWidth = pageWidth - marginX * 2;
  let pageCount = 0;

  // Track page numbers for TOC
  const chapterPageMap: { title: string; pageNumber: number }[] = [];

  // Helper to add page with number tracking
  const addNewPage = () => {
    doc.addPage();
    pageCount++;
  };

  // 1. COVER PAGE
  if (options.includeCover) {
    pageCount = 1; // First page already exists in jsPDF
    const primary = book.cover.primaryColor || '#1e293b';
    const secondary = book.cover.secondaryColor || '#d97706';

    // Background
    const rgb = hexToRgb(primary);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Inner decorative frame
    const secRgb = hexToRgb(secondary);
    doc.setDrawColor(secRgb.r, secRgb.g, secRgb.b);
    doc.setLineWidth(0.8);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setLineWidth(0.3);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Cover Emblem / Ornament
    doc.setTextColor(secRgb.r, secRgb.g, secRgb.b);
    doc.setFont('times', 'normal');
    doc.setFontSize(16);
    doc.text('✦  ·  ✦  ·  ✦', pageWidth / 2, 45, { align: 'center' });

    // Cover Title
    doc.setTextColor(255, 255, 255);
    doc.setFont(font, 'bold');
    const titleSize = options.pageSize === 'trade' ? 24 : 28;
    doc.setFontSize(titleSize);
    const titleLines = doc.splitTextToSize(book.title.toUpperCase(), contentWidth - 10);
    doc.text(titleLines, pageWidth / 2, pageHeight * 0.36, { align: 'center' });

    // Cover Subtitle
    if (book.subtitle) {
      doc.setFont(font, 'italic');
      doc.setFontSize(13);
      doc.setTextColor(230, 230, 230);
      const subtitleLines = doc.splitTextToSize(book.subtitle, contentWidth - 15);
      doc.text(subtitleLines, pageWidth / 2, pageHeight * 0.47, { align: 'center' });
    }

    // Divider line
    doc.setDrawColor(secRgb.r, secRgb.g, secRgb.b);
    doc.setLineWidth(0.6);
    doc.line(pageWidth / 2 - 25, pageHeight * 0.62, pageWidth / 2 + 25, pageHeight * 0.62);

    // Author
    doc.setFont(font, 'normal');
    doc.setFontSize(15);
    doc.setTextColor(secRgb.r, secRgb.g, secRgb.b);
    doc.text(book.author.toUpperCase(), pageWidth / 2, pageHeight * 0.75, { align: 'center' });

    // Imprint footer
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text('A BOOKMAKER EDITION', pageWidth / 2, pageHeight - 20, { align: 'center' });
  }

  // 2. TITLE / HALF TITLE PAGE
  if (options.includeTitlePage) {
    if (options.includeCover) {
      addNewPage();
    } else {
      pageCount = 1;
    }

    // Centered Title
    doc.setTextColor(30, 30, 30);
    doc.setFont(font, 'bold');
    doc.setFontSize(22);
    const titleLines = doc.splitTextToSize(book.title, contentWidth);
    doc.text(titleLines, pageWidth / 2, pageHeight * 0.35, { align: 'center' });

    if (book.subtitle) {
      doc.setFont(font, 'italic');
      doc.setFontSize(12);
      doc.setTextColor(90, 90, 90);
      doc.text(book.subtitle, pageWidth / 2, pageHeight * 0.43, { align: 'center' });
    }

    // Decorative line
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 20, pageHeight * 0.52, pageWidth / 2 + 20, pageHeight * 0.52);

    // Author
    doc.setFont(font, 'normal');
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(book.author, pageWidth / 2, pageHeight * 0.60, { align: 'center' });

    // 3. COPYRIGHT & DEDICATION PAGE
    if (options.includeDedication) {
      addNewPage();

      // Dedication
      if (book.dedication) {
        doc.setFont(font, 'italic');
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        const dedLines = doc.splitTextToSize(book.dedication, contentWidth * 0.8);
        doc.text(dedLines, pageWidth / 2, pageHeight * 0.35, { align: 'center' });
      }

      // Foreword / Epigraph
      if (book.foreword) {
        doc.setFont(font, 'italic');
        doc.setFontSize(10.5);
        doc.setTextColor(80, 80, 80);
        const foreLines = doc.splitTextToSize(`"${book.foreword}"`, contentWidth * 0.75);
        doc.text(foreLines, pageWidth / 2, pageHeight * 0.50, { align: 'center' });
      }

      // Copyright block at bottom
      doc.setFont(font, 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      const copyText = book.copyright || `© ${new Date().getFullYear()} ${book.author}. All rights reserved.`;
      const copyLines = doc.splitTextToSize(copyText, contentWidth * 0.9);
      doc.text(copyLines, marginX, pageHeight - marginBottom - 15);
    }
  }

  // TOC placeholder page index
  let tocPageIndex = 0;
  if (options.includeToc) {
    addNewPage();
    tocPageIndex = doc.getNumberOfPages();
  }

  // 4. CHAPTERS
  let bodyPageNumber = 1;
  const firstChapterPage = doc.getNumberOfPages() + 1;

  for (let cIdx = 0; cIdx < book.chapters.length; cIdx++) {
    const chapter = book.chapters[cIdx];
    addNewPage();
    const currentActualPage = doc.getNumberOfPages();
    chapterPageMap.push({
      title: chapter.title || `Chapter ${cIdx + 1}`,
      pageNumber: currentActualPage - firstChapterPage + 1,
    });

    let currentY = marginTop + 10;

    // Running Header (skip on chapter start page)
    // Chapter Title Heading
    doc.setTextColor(20, 20, 20);
    doc.setFont(font, 'bold');
    doc.setFontSize(17);
    const chapTitleLines = doc.splitTextToSize(chapter.title || `Chapter ${cIdx + 1}`, contentWidth);
    doc.text(chapTitleLines, pageWidth / 2, currentY, { align: 'center' });
    currentY += chapTitleLines.length * 7 + 4;

    // Chapter Subtitle
    if (chapter.subtitle) {
      doc.setFont(font, 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(100, 100, 100);
      const subLines = doc.splitTextToSize(chapter.subtitle, contentWidth);
      doc.text(subLines, pageWidth / 2, currentY, { align: 'center' });
      currentY += subLines.length * 5 + 6;
    }

    // Small ornament
    doc.setFont(font, 'normal');
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text('~ ❦ ~', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Chapter Content
    doc.setTextColor(30, 30, 30);
    doc.setFont(font, 'normal');
    const baseFontSize = options.fontSize;
    const lineHeightMm = (baseFontSize * 0.3527) * options.lineSpacing;

    const paragraphs = chapter.content.split(/\n\s*\n/);

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      // Handle Scene Break
      if (trimmed === '* * *' || trimmed === '---' || trimmed === '***') {
        if (currentY + 12 > pageHeight - marginBottom) {
          renderFooter(doc, pageWidth, pageHeight, marginBottom, bodyPageNumber, options);
          bodyPageNumber++;
          addNewPage();
          currentY = marginTop;
          renderHeader(doc, pageWidth, marginTop, marginX, book.title, chapter.title, font, bodyPageNumber, options);
        }
        currentY += 4;
        doc.setFontSize(11);
        doc.setTextColor(130, 130, 130);
        doc.text('✦   ✦   ✦', pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
        continue;
      }

      // Handle Blockquote
      const isQuote = trimmed.startsWith('>');
      const isHeading = trimmed.startsWith('#');
      let textToRender = trimmed;

      if (isQuote) {
        textToRender = trimmed.replace(/^>\s*/gm, '');
        doc.setFont(font, 'italic');
        doc.setFontSize(baseFontSize - 0.5);
        doc.setTextColor(70, 70, 70);
      } else if (isHeading) {
        textToRender = trimmed.replace(/^#+\s*/, '');
        doc.setFont(font, 'bold');
        doc.setFontSize(baseFontSize + 2);
        doc.setTextColor(30, 30, 30);
      } else {
        doc.setFont(font, 'normal');
        doc.setFontSize(baseFontSize);
        doc.setTextColor(30, 30, 30);
      }

      const indent = isQuote ? 6 : 0;
      const effectiveWidth = contentWidth - indent * 2;
      const lines = doc.splitTextToSize(textToRender, effectiveWidth);

      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeightMm > pageHeight - marginBottom) {
          renderFooter(doc, pageWidth, pageHeight, marginBottom, bodyPageNumber, options);
          bodyPageNumber++;
          addNewPage();
          currentY = marginTop;
          renderHeader(doc, pageWidth, marginTop, marginX, book.title, chapter.title, font, bodyPageNumber, options);
        }

        const xPos = marginX + indent;
        doc.text(lines[i], xPos, currentY);
        currentY += lineHeightMm;
      }

      // Paragraph spacing
      currentY += lineHeightMm * 0.6;
    }

    // Render footer on the last page of this chapter
    renderFooter(doc, pageWidth, pageHeight, marginBottom, bodyPageNumber, options);
    bodyPageNumber++;
  }

  // 5. FILL TABLE OF CONTENTS PAGE (if requested)
  if (options.includeToc && tocPageIndex > 0) {
    doc.setPage(tocPageIndex);
    let tocY = marginTop + 10;

    doc.setFont(font, 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('TABLE OF CONTENTS', pageWidth / 2, tocY, { align: 'center' });
    tocY += 15;

    doc.setFont(font, 'normal');
    doc.setFontSize(10.5);

    for (const item of chapterPageMap) {
      if (tocY > pageHeight - marginBottom - 10) break;
      const titleStr = item.title;
      const pageStr = String(item.pageNumber);

      doc.setTextColor(40, 40, 40);
      doc.text(titleStr, marginX, tocY);

      // Dot leaders
      const textWidth = doc.getTextWidth(titleStr);
      const pageNumWidth = doc.getTextWidth(pageStr);
      const dotsStartX = marginX + textWidth + 3;
      const dotsEndX = pageWidth - marginX - pageNumWidth - 3;

      if (dotsEndX > dotsStartX) {
        doc.setTextColor(180, 180, 180);
        let dotX = dotsStartX;
        while (dotX < dotsEndX) {
          doc.text('.', dotX, tocY);
          dotX += 3;
        }
      }

      doc.setTextColor(40, 40, 40);
      doc.text(pageStr, pageWidth - marginX, tocY, { align: 'right' });
      tocY += 8;
    }
  }

  return doc.output('blob');
};

function renderHeader(
  doc: jsPDF,
  pageWidth: number,
  marginTop: number,
  marginX: number,
  bookTitle: string,
  chapterTitle: string,
  font: string,
  pageNumber: number,
  options: PdfExportOptions
) {
  if (!options.headerTitle) return;
  doc.setFont(font, 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(140, 140, 140);
  const isEven = pageNumber % 2 === 0;
  const headerText = isEven ? bookTitle : chapterTitle;
  const align = isEven ? 'left' : 'right';
  const x = isEven ? marginX : pageWidth - marginX;
  doc.text(headerText.slice(0, 45), x, marginTop - 8, { align });
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(marginX, marginTop - 6, pageWidth - marginX, marginTop - 6);
}

function renderFooter(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  marginBottom: number,
  pageNumber: number,
  options: PdfExportOptions
) {
  if (!options.pageNumbering) return;
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(String(pageNumber), pageWidth / 2, pageHeight - marginBottom + 8, { align: 'center' });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(ch => ch + ch).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
