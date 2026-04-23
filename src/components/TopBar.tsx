import React, { useRef, useState, useEffect } from 'react';
import { 
  FileArchive, FileCode2, Upload, GitCommitHorizontal, CheckCircle2 
} from 'lucide-react';
import { useIde } from '../hooks/useIdeContext';
import { downloadSingleHtml, downloadZip, parseUploadedFile } from '../lib/export';

export function TopBar() {
  const { viewportMode, setViewportMode, files, commitProject, loadFiles } = useIde();
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
    <header className="border-b border-[#262626] flex flex-col lg:flex-row items-center lg:justify-between px-2 py-3 lg:py-0 lg:h-14 bg-[#111111] shrink-0 gap-3 lg:gap-0 overflow-x-hidden">
      <div className="flex items-center gap-4 w-full lg:w-auto justify-center lg:justify-start">
        <div className="font-bold text-neutral-100 tracking-tight flex items-center gap-2 lg:mr-4 text-sm">
          <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            <FileCode2 size={16} />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-neutral-100 text-sm leading-tight tracking-tight">Codev IDE</span>
            <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
              {saveStatus === 'saving' ? (
                <>Saving...</>
              ) : (
                <><CheckCircle2 size={10} className="text-blue-500" /> Auto-saved</>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto pb-1 lg:pb-0">
        {/* Commit Input Area */}
        {showCommitInput ? (
          <div className="flex items-center gap-2 mr-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Commit message..." 
              className="bg-[#1A1A1A] border border-[#262626] text-xs rounded px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 w-48 placeholder-neutral-500"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommit()}
            />
            <button onClick={handleCommit} className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors shadow">
              Save
            </button>
            <button onClick={() => setShowCommitInput(false)} className="text-xs hover:bg-[#262626] text-neutral-400 hover:text-white px-3 py-1.5 rounded transition-colors">
              Cancel
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowCommitInput(true)} 
            className="flex items-center gap-1.5 text-xs font-medium hover:text-white hover:bg-[#262626] px-3 py-1.5 rounded transition-colors"
            title="Commit changes"
          >
            <GitCommitHorizontal size={14} className="text-emerald-400" /> Commit
          </button>
        )}

        <div className="w-px h-6 bg-[#262626] mx-1"></div>

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
          className="flex items-center gap-1.5 text-xs font-medium hover:text-white hover:bg-[#262626] px-3 py-1.5 rounded transition-colors border border-transparent hover:border-[#262626] text-neutral-400"
          title="Upload .zip or .html file"
        >
          <Upload size={14} /> Import
        </button>
        <button 
          onClick={() => downloadSingleHtml(files)}
          className="flex items-center gap-1.5 text-xs font-medium hover:text-white hover:bg-[#262626] px-3 py-1.5 rounded transition-colors border border-transparent hover:border-[#262626] text-neutral-400"
          title="Download as single HTML file"
        >
          <FileCode2 size={14} /> Export HTML
        </button>
        <button 
          onClick={() => downloadZip(files)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          title="Download as ZIP"
        >
          <FileArchive size={14} /> Export ZIP
        </button>
      </div>
    </header>
  );
}
