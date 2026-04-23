export type FileType = 'html' | 'css' | 'javascript' | 'image' | 'folder';

export interface FileDef {
  name: string;
  language: FileType;
  content: string; // Will store base64 for images
}

export type FilesRecord = Record<string, FileDef>;

export interface Commit {
  id: string;
  message: string;
  timestamp: string;
  files: FilesRecord;
}

export type ViewportMode = 'desktop' | 'mobile';

export interface ProjectState {
  files: FilesRecord;
  history: Commit[];
}
