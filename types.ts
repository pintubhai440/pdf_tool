export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type AppView = 'home' | 'ai-chat';

export type AppMode = 'home' | 'merge' | 'split' | 'convert' | 'compress' | 'resize' | 'protect' | 'about' | 'contact' | 'policy' | 'terms' | 'signature';

export type ConversionFormat = 'jpg' | 'png' | 'pdf' | 'txt' | 'json' | 'docx';
