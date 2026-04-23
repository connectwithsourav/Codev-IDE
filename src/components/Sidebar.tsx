import React, { useState } from 'react';
import { useIde } from '../hooks/useIdeContext';
import { FileCode2, RefreshCcw, FileCode, FileJson, Clock, History, Folder, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function Sidebar() {
  const { files, activeFile, setActiveFile, history, restoreCommit } = useIde();
  const [tab, setTab] = useState<'files' | 'history'>('files');

  return (
    <aside className="h-full flex flex-col bg-[#111111] rounded-2xl border border-[#262626] text-neutral-300 font-medium z-10 w-full overflow-hidden">
      <div className="flex bg-[#161616] border-b border-[#262626] px-4 py-2 gap-4">
        <button 
          onClick={() => setTab('files')} 
          className={cn("text-xs transition-colors", tab === 'files' ? "font-semibold text-blue-400 border-b-2 border-blue-400 pb-1" : "font-medium text-neutral-500 hover:text-neutral-300 pb-1")}
        >
          Files
        </button>
        <button 
          onClick={() => setTab('history')} 
          className={cn("text-xs transition-colors", tab === 'history' ? "font-semibold text-blue-400 border-b-2 border-blue-400 pb-1" : "font-medium text-neutral-500 hover:text-neutral-300 pb-1")}
        >
          History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        {tab === 'files' ? (
          <div className="p-2 flex flex-col space-y-1">
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-neutral-400 select-none">
              <ChevronDown size={14} className="text-neutral-500" />
              <Folder size={14} className="text-blue-400" />
              <span>Project Root</span>
            </div>
            <div className="pl-5 flex flex-col space-y-0.5 border-l border-[#262626] ml-4 mt-1 w-full relative">
              {Object.values(files).map((file: any) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file.name)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm w-[90%] text-left transition-colors border border-transparent truncate whitespace-nowrap",
                    activeFile === file.name ? "text-blue-500 bg-blue-500/10 font-semibold" : "hover:bg-[#262626] hover:text-neutral-200"
                  )}
                  title={file.name}
                >
                  <span className="shrink-0">
                    {file.language === 'html' && <FileCode2 size={14} className="text-orange-400" />}
                    {file.language === 'css' && <FileCode size={14} className="text-blue-400" />}
                    {file.language === 'javascript' && <FileJson size={14} className="text-yellow-400" />}
                  </span>
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          </div>

        ) : (
          <div className="p-0">
            {history.length === 0 ? (
              <div className="p-6 text-center text-sm text-neutral-500 mt-10 flex flex-col items-center">
                <History className="mb-3 opacity-20" size={48} />
                <p>No commits yet.</p>
                <p className="mt-1 opacity-70">Make a commit to save your progress!</p>
              </div>
            ) : (
              <div className="flex flex-col p-2 gap-2">
                {history.map((commit) => (
                  <div key={commit.id} className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl hover:bg-blue-600/20 group transition-colors overflow-hidden relative">
                    <div className="relative z-10">
                      <p className="font-semibold text-white text-sm leading-tight mb-1 break-words">{commit.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-blue-400">
                          <Clock size={12} />
                          {formatDistanceToNow(new Date(commit.timestamp), { addSuffix: true })}
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('Restore this commit? Any unsaved changes will be lost.')) {
                              restoreCommit(commit.id);
                            }
                          }}
                          className="text-xs flex items-center gap-1 text-blue-300/70 hover:text-white bg-[#262626] hover:bg-blue-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100"
                          title="Restore this commit"
                        >
                          <RefreshCcw size={12} /> Restore
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
