export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  status: 'draft' | 'in_progress' | 'completed';
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export type CoverStyle = 'classic' | 'modern' | 'vintage' | 'minimal' | 'bold' | 'fantasy';
export type CoverEmblem = 'feather' | 'book' | 'star' | 'crown' | 'compass' | 'tree' | 'none';

export interface CoverConfig {
  style: CoverStyle;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  titleFont: 'serif' | 'sans' | 'display' | 'cinzel';
  authorFont: 'serif' | 'sans';
  customImage?: string | null;
  emblem: CoverEmblem;
}

export interface BookSettings {
  defaultFont: 'serif' | 'sans' | 'mono' | 'display';
  fontSize: number; // 14, 16, 18, 20
  lineHeight: number; // 1.5, 1.75, 2.0
  pageWidth: 'narrow' | 'medium' | 'wide';
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  genre: string;
  language: string;
  synopsis: string;
  dedication: string;
  copyright: string;
  foreword: string;
  cover: CoverConfig;
  chapters: Chapter[];
  settings: BookSettings;
  createdAt: number;
  updatedAt: number;
}

export interface PdfExportOptions {
  pageSize: 'trade' | 'a4' | 'a5' | 'letter'; // trade = 6x9 inch
  fontFamily: 'serif' | 'sans';
  includeCover: boolean;
  includeTitlePage: boolean;
  includeDedication: boolean;
  includeToc: boolean;
  pageNumbering: boolean;
  headerTitle: boolean;
  fontSize: number; // standard pt size
  lineSpacing: number; // 1.15, 1.3, 1.5
  chapterPageBreak: boolean;
}

export interface StorageStatus {
  lastSaved: number | null;
  isSaving: boolean;
  bookCount: number;
  totalWords: number;
  estimatedKb: number;
}
