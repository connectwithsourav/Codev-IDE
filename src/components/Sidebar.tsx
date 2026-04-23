import React, { useState, useRef } from 'react';
import { useIde } from '../hooks/useIdeContext';
import { FileCode2, RefreshCcw, FileCode, FileJson, Clock, History, Folder, ChevronDown, Plus, Image as ImageIcon, FolderPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function Sidebar() {
  const { files, addFile, activeFile, setActiveFile, history, restoreCommit } = useIde();
  const [tab, setTab] = useState<'files' | 'history'>('files');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFolder, setUploadFolder] = useState<string>('');
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleAddAsset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const finalName = uploadFolder ? `${uploadFolder}/${file.name}` : file.name;
        addFile({
          name: finalName,
          language: 'image',
          content: base64
        });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadFolder('');
  };

  const folders = Object.values(files).filter((f: any) => f.language === 'folder');
  const rootFiles = Object.values(files).filter((f: any) => f.language !== 'folder' && !f.name.includes('/'));

  const FileItem = ({ file, ...props }: { file: any; [key: string]: any }) => (
    <button
      {...props}
      onClick={() => {
        if (file.language !== 'image') setActiveFile(file.name);
      }}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm w-full text-left transition-colors border border-transparent overflow-hidden",
        activeFile === file.name ? "text-blue-500 bg-blue-500/10 font-semibold" : "hover:bg-[#262626] hover:text-neutral-200",
        file.language === 'image' && "cursor-default text-neutral-400"
      )}
      title={file.name}
    >
      <span className="shrink-0 flex items-center justify-center w-4 h-4">
        {file.language === 'html' && <FileCode2 size={15} className="text-orange-400" />}
        {file.language === 'css' && <FileCode size={15} className="text-blue-400" />}
        {file.language === 'javascript' && <FileJson size={15} className="text-yellow-400" />}
        {file.language === 'image' && <ImageIcon size={15} className="text-pink-400" />}
      </span>
      <span className="truncate whitespace-nowrap leading-none pt-0.5">{file.name.split('/').pop()}</span>
    </button>
  );

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
            <div className="flex items-center justify-between px-2 py-1.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 select-none">
                <ChevronDown size={14} className="text-neutral-500" />
                <Folder size={14} className="text-blue-400" />
                <span>Project Root</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAddAsset} 
                accept="image/*" 
                className="hidden"
              />
              <div className="flex gap-0.5">
                <button 
                  onClick={() => setIsCreatingFolder(true)}
                  className="p-1 hover:bg-[#262626] rounded text-neutral-400 hover:text-white transition-colors"
                  title="New Folder"
                >
                  <FolderPlus size={14} />
                </button>
                <button 
                  onClick={() => {
                    setUploadFolder('');
                    fileInputRef.current?.click();
                  }}
                  className="p-1 hover:bg-[#262626] rounded text-neutral-400 hover:text-white transition-colors"
                  title="Add Image Asset"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            
            <div className="pl-3 pr-2 flex flex-col space-y-0.5 border-l border-[#262626] ml-3 mt-1 relative w-auto">
              
              {isCreatingFolder && (
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm w-full transition-colors border border-blue-500/50 bg-[#262626]/40 mb-1">
                  <Folder size={14} className="text-blue-400 shrink-0" />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Folder name..."
                    className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (newFolderName.trim() && !files[newFolderName.trim()]) {
                          addFile({ name: newFolderName.trim(), language: 'folder', content: '' });
                        }
                        setNewFolderName('');
                        setIsCreatingFolder(false);
                      } else if (e.key === 'Escape') {
                        setIsCreatingFolder(false);
                        setNewFolderName('');
                      }
                    }}
                    onBlur={() => {
                      setIsCreatingFolder(false);
                      setNewFolderName('');
                    }}
                  />
                </div>
              )}

              {rootFiles.map((file: any) => (
                <FileItem key={file.name} file={file} />
              ))}
              
              {folders.map((folder: any) => {
                const folderFiles = Object.values(files).filter((f: any) => f.language !== 'folder' && f.name.startsWith(folder.name + '/'));
                return (
                  <div key={folder.name} className="mt-2 w-full">
                    <div className="flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-neutral-400 select-none group hover:bg-[#262626]/50 rounded-lg mb-1 transition-colors">
                      <div className="flex items-center gap-2">
                        <ChevronDown size={12} className="text-neutral-500" />
                        <Folder size={14} className="text-emerald-400" />
                        <span className="truncate max-w-[100px]">{folder.name}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setUploadFolder(folder.name);
                          fileInputRef.current?.click();
                        }}
                        className="p-1 hover:bg-[#333] rounded text-neutral-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                        title={`Add Image to ${folder.name}`}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="pl-3 pr-1 flex flex-col space-y-0.5 border-l border-[#262626]/50 ml-2 mt-0.5 relative">
                      {folderFiles.map((file: any) => (
                        <FileItem key={file.name} file={file} />
                      ))}
                    </div>
                  </div>
                );
              })}
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
