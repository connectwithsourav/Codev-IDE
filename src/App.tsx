import React, { useState, useEffect } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { IdeProvider, useIde } from './hooks/useIdeContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { FolderIcon, Code2Icon, PlayIcon } from 'lucide-react';

function AppContent() {
  const { isSidebarOpen } = useIde();
  const [mobileTab, setMobileTab] = useState<'files' | 'code' | 'preview'>('code');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Breakpoint at 1024px to cover both mobile and tablet devices
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0A0A0A] text-neutral-300 overflow-hidden font-sans border-4 lg:border-8 border-[#1A1A1A]">
      <TopBar />
      
      {/* Desktop Layout */}
      {!isMobile && (
        <main className="flex-1 min-h-0 flex overflow-hidden p-3 gap-3">
          <PanelGroup direction="horizontal">
            {/* Sidebar Panel */}
            {isSidebarOpen && (
              <>
                <Panel id="sidebar" order={1} defaultSize={20} minSize={15} maxSize={35} className="flex h-full">
                  <Sidebar />
                </Panel>

                <PanelResizeHandle className="w-3 bg-transparent cursor-col-resize flex flex-col items-center justify-center relative group">
                   <div className="absolute top-1/2 -mt-4 w-1 h-8 bg-[#262626] group-hover:bg-blue-500 rounded transition-colors" />
                </PanelResizeHandle>
              </>
            )}

            {/* Editor Panel */}
            <Panel id="editor" order={2} defaultSize={isSidebarOpen ? 40 : 60} minSize={20} className="flex h-full">
              <CodeEditor />
            </Panel>
            
            <PanelResizeHandle className="w-3 bg-transparent cursor-col-resize flex flex-col items-center justify-center relative group">
              <div className="absolute top-1/2 -mt-4 w-1 h-8 bg-[#262626] group-hover:bg-blue-500 rounded transition-colors" />
            </PanelResizeHandle>
            
            {/* Preview Panel */}
            <Panel id="preview" order={3} defaultSize={40} minSize={20} className="flex h-full">
              <Preview />
            </Panel>
          </PanelGroup>
        </main>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden p-2 gap-2 relative">
          <div className="flex-1 overflow-hidden">
            {mobileTab === 'files' && <Sidebar />}
            {mobileTab === 'code' && <CodeEditor />}
            {mobileTab === 'preview' && <Preview />}
          </div>
          
          {/* Bottom Tab Layout */}
          <div className="flex bg-[#111111] border border-[#262626] rounded-2xl shrink-0 p-1 mb-2">
            <button
              onClick={() => setMobileTab('files')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors ${mobileTab === 'files' ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <FolderIcon size={20} />
              <span className="text-[10px] font-semibold">Files</span>
            </button>
            <button
              onClick={() => setMobileTab('code')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors ${mobileTab === 'code' ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <Code2Icon size={20} />
              <span className="text-[10px] font-semibold">Code</span>
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-colors ${mobileTab === 'preview' ? 'text-blue-400 bg-blue-500/10' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              <PlayIcon size={20} />
              <span className="text-[10px] font-semibold">Preview</span>
            </button>
          </div>
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <IdeProvider>
      <AppContent />
    </IdeProvider>
  );
}
