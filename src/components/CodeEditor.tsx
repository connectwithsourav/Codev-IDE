import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useIde } from '../hooks/useIdeContext';
import { Code2, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function CodeEditor() {
  const { files, activeFile, updateFile, setActiveFile } = useIde();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const file = files[activeFile];
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  if (!file) return null;

  return (
    <div className={cn(
      "flex flex-col bg-[#111111] overflow-hidden w-full relative",
      isFullscreen ? "fixed top-0 left-0 right-0 bottom-0 z-50 rounded-none border-0" : "h-full rounded-2xl border border-[#262626] z-0"
    )}>
      <div className="flex items-center justify-between px-4 border-b border-[#262626] bg-[#161616] shrink-0 min-h-12">
        <div className="flex gap-4 self-end overflow-x-auto whitespace-nowrap">
          {Object.values(files).map((f: any) => (
            <button
              key={f.name}
              onClick={() => { setActiveFile(f.name); }}
              className={cn(
                "text-xs font-semibold pb-1.5 transition-colors border-b-2 mt-2.5",
                activeFile === f.name ? "text-blue-400 border-blue-400" : "text-neutral-500 hover:text-neutral-300 border-transparent"
              )}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 lg:gap-3 text-neutral-500 shrink-0 ml-2">
          <span className="text-[10px] uppercase tracking-wider font-bold hidden md:inline">Monaco Editor</span>
          <button 
            onClick={formatCode}
            className="text-xs font-semibold tracking-wide text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-[#262626] hover:bg-blue-600 rounded border border-transparent hover:border-white/10 transition-colors"
            title="Format Code (Shift+Alt+F)"
          >
            <Code2 size={14} /> <span className="hidden sm:inline">Format</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-neutral-400 hover:text-white p-1.5 transition-colors bg-[#262626] hover:bg-[#333] rounded ml-1"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={file.language}
          theme="vs-dark"
          value={file.content}
          path={file.name} // Allows Monaco to link references across files conceptually (for TS/JS)
          onChange={(val) => {
            if (val !== undefined) updateFile(activeFile, val);
          }}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 20 },
            formatOnPaste: true,
            tabSize: 2,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
