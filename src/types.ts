export type FileType = 'html' | 'css' | 'javascript';

export interface FileDef {
  name: string;
  language: FileType;
  content: string;
}

export type FilesRecord = Record<string, FileDef>;

export interface Commit {
  id: string;
  message: string;
  timestamp: string;
  files: FilesRecord;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ProjectState {
  files: FilesRecord;
  history: Commit[];
}
