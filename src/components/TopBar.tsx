import React, { useRef, useState, useEffect } from 'react';
import { 
  FileArchive, FileCode2, Upload, GitCommitHorizontal, CheckCircle2,
  TerminalSquare, Braces, Code2, PanelLeft
} from 'lucide-react';
import { useIde } from '../hooks/useIdeContext';
import { cn } from '../lib/utils';
import { downloadSingleHtml, downloadZip, parseUploadedFile } from '../lib/export';

export function TopBar() {
  const { viewportMode, setViewportMode, files, commitProject, loadFiles, isSidebarOpen, toggleSidebar } = useIde();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commitMessage, setCommitMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Any files change triggers "saving..." briefly since it updates dynamically
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [files]);
  const [showCommitInput, setShowCommitInput] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const parsedFiles = await parseUploadedFile(file);
      if (parsedFiles) {
        loadFiles(parsedFiles);
      } else {
        alert("Could not parse file. Ensure it's a valid HTML or ZIP file.");
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCommit = () => {
    if (commitMessage.trim()) {
      commitProject(commitMessage.trim());
      setCommitMessage('');
      setShowCommitInput(false);
    }
  };

  return (
    <header className="relative border-b border-[#262626] flex flex-col lg:flex-row items-center lg:justify-between px-4 py-5 lg:py-0 lg:h-16 bg-[#111111] shrink-0 gap-5 lg:gap-0 overflow-hidden shadow-sm">
      
      {/* Decorative SVG Background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-around opacity-[0.05] select-none">
        <TerminalSquare size={140} className="text-blue-500 -rotate-12 transform -translate-y-4" />
        <Code2 size={160} className="text-emerald-500 rotate-12 transform translate-y-6 lg:translate-x-12 hidden md:block" />
        <Braces size={180} className="text-indigo-500 -rotate-6 transform translate-y-2 hidden lg:block" />
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start relative z-10">
        <button
          onClick={toggleSidebar}
          className={cn(
            "hidden lg:flex p-2 rounded-lg transition-colors border shadow-sm",
            isSidebarOpen 
              ? "bg-[#262626] text-white border-[#333]" 
              : "hover:bg-[#262626] text-neutral-400 hover:text-white border-transparent"
          )}
          title="Toggle Sidebar"
        >
          <PanelLeft size={20} />
        </button>
        <div className="font-bold text-neutral-100 tracking-tight flex items-center gap-3 lg:mr-6 text-sm">
          <div className="relative w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-blue-400 opacity-20 blur-md hidden lg:block"></div>
            <FileCode2 size={20} className="relative z-10" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-neutral-100 text-[15px] leading-tight tracking-tight">Codev IDE</span>
            <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
              {saveStatus === 'saving' ? (
                <span className="text-neutral-400">Saving...</span>
              ) : (
                <><CheckCircle2 size={11} className="text-blue-500" /> Auto-saved</>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto pb-1 lg:pb-0 relative z-10">
        {/* Commit Input Area */}
        {showCommitInput ? (
          <div className="flex items-center gap-2 mr-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Commit message..." 
              className="bg-[#1A1A1A] border border-[#262626] text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 w-48 placeholder-neutral-500 shadow-inner"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
            />
            <button onClick={handleCommit} className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
              Save
            </button>
            <button onClick={() => setShowCommitInput(false)} className="text-xs font-medium hover:bg-[#262626] text-neutral-400 hover:text-white px-3 py-2 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowCommitInput(true)} 
            className="flex items-center gap-1.5 text-xs font-medium hover:text-white hover:bg-[#262626] px-3 py-2 rounded-lg transition-colors"
            title="Commit changes"
          >
            <GitCommitHorizontal size={16} className="text-emerald-400" /> <span>Commit</span>
          </button>
        )}

        <div className="w-px h-6 bg-[#262626] mx-1 hidden sm:block"></div>

        {/* Import/Export */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept=".html,.zip" 
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 text-xs font-medium hover:text-white hover:bg-[#262626] px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-[#262626] text-neutral-400"
          title="Upload .zip or .html file"
        >
          <Upload size={14} /> Import
        </button>
        <button 
          onClick={() => downloadSingleHtml(files)}
          className="flex items-center gap-1.5 text-xs font-medium hover:text-white hover:bg-[#262626] px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-[#262626] text-neutral-400"
          title="Download as single HTML file"
        >
          <FileCode2 size={14} /> Export HTML
        </button>
        <button 
          onClick={() => downloadZip(files)}
          className="flex items-center gap-2 px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-md border border-indigo-500/30"
          title="Download as ZIP"
        >
          <FileArchive size={14} /> Export ZIP
        </button>
      </div>
    </header>
  );
}
