import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { FilesRecord, Commit, ViewportMode } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface IdeContextType {
  files: FilesRecord;
  updateFile: (name: string, content: string) => void;
  activeFile: string;
  setActiveFile: (name: string) => void;
  history: Commit[];
  commitProject: (message: string) => void;
  restoreCommit: (commitId: string) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  loadFiles: (newFiles: FilesRecord) => void;
}

const DEFAULT_FILES: FilesRecord = {
  'index.html': { name: 'index.html', language: 'html', content: '<div class="container">\n  <div class="logo">🚀</div>\n  <h1>Welcome to Web IDE</h1>\n  <p>Start writing HTML, CSS, and JS. The preview updates magically!</p>\n  <button id="clickMe">Click Me</button>\n</div>' },
  'styles.css': { name: 'styles.css', language: 'css', content: 'body {\n  font-family: system-ui, -apple-system, sans-serif;\n  color: #1e293b;\n  background: #f8fafc;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  padding: 1rem;\n}\n\n.container {\n  text-align: center;\n  background: white;\n  padding: 3rem 2rem;\n  border-radius: 1rem;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.05);\n}\n\n.logo {\n  font-size: 4rem;\n  margin-bottom: 1rem;\n}\n\nh1 {\n  color: #0f172a;\n  margin-top: 0;\n}\n\nbutton {\n  background: #3b82f6;\n  color: white;\n  border: none;\n  padding: 0.75rem 1.5rem;\n  border-radius: 0.5rem;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background 0.2s;\n  margin-top: 1rem;\n}\n\nbutton:hover {\n  background: #2563eb;\n}\n' },
  'script.js': { name: 'script.js', language: 'javascript', content: 'console.log("Welcome to Web IDE Pro!");\n\ndocument.getElementById("clickMe").addEventListener("click", () => {\n  alert("Button clicked! You are ready to start building.");\n});' }
};

const IdeContext = createContext<IdeContextType | null>(null);

export const IdeProvider = ({ children }: { children: React.ReactNode }) => {
  const [files, setFiles] = useState<FilesRecord>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [history, setHistory] = useState<Commit[]>([]);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');

  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('webide-files');
      const savedHistory = localStorage.getItem('webide-history');
      if (savedFiles) setFiles(JSON.parse(savedFiles));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch(e) {
      console.error("Could not load saved state", e);
    }
  }, []);

  const saveState = useCallback((newFiles: FilesRecord, newHistory: Commit[]) => {
    localStorage.setItem('webide-files', JSON.stringify(newFiles));
    localStorage.setItem('webide-history', JSON.stringify(newHistory));
  }, []);

  const updateFile = (name: string, content: string) => {
    const newFiles = {
      ...files,
      [name]: { ...files[name], content }
    };
    setFiles(newFiles);
    localStorage.setItem('webide-files', JSON.stringify(newFiles));
  };

  const commitProject = (message: string) => {
    const newCommit: Commit = {
      id: uuidv4(),
      message,
      timestamp: new Date().toISOString(),
      files: JSON.parse(JSON.stringify(files)) // Deep copy
    };
    const newHistory = [newCommit, ...history];
    setHistory(newHistory);
    saveState(files, newHistory);
  };

  const restoreCommit = (commitId: string) => {
    const commit = history.find(c => c.id === commitId);
    if (commit) {
      setFiles(JSON.parse(JSON.stringify(commit.files)));
      saveState(commit.files, history);
    }
  };

  const loadFiles = (newFiles: FilesRecord) => {
    const mergedFiles = { ...DEFAULT_FILES };
    if (newFiles['index.html']) mergedFiles['index.html'] = newFiles['index.html'];
    if (newFiles['styles.css']) mergedFiles['styles.css'] = newFiles['styles.css'];
    if (newFiles['script.js']) mergedFiles['script.js'] = newFiles['script.js'];
    setFiles(mergedFiles);
    localStorage.setItem('webide-files', JSON.stringify(mergedFiles));
  };

  return (
    <IdeContext.Provider value={{
      files, updateFile, activeFile, setActiveFile,
      history, commitProject, restoreCommit,
      viewportMode, setViewportMode, loadFiles
    }}>
      {children}
    </IdeContext.Provider>
  );
};

export const useIde = () => {
  const context = useContext(IdeContext);
  if (!context) throw new Error("useIde must be used within an IdeProvider");
  return context;
};
