import React from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { IdeProvider } from './hooks/useIdeContext';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';

export default function App() {
  return (
    <IdeProvider>
      <div className="h-screen w-screen flex flex-col bg-[#0A0A0A] text-neutral-300 overflow-hidden font-sans border-[#1A1A1A] border-8">
        <TopBar />
        
        <main className="flex-1 min-h-0 flex overflow-hidden p-3 gap-3">
          <PanelGroup direction="horizontal">
            {/* Sidebar Panel */}
            <Panel defaultSize={18} minSize={15} maxSize={30} className="flex h-full">
              <Sidebar />
            </Panel>

            <PanelResizeHandle className="w-3 bg-transparent cursor-col-resize flex flex-col items-center justify-center relative group">
               <div className="absolute top-1/2 -mt-4 w-1 h-8 bg-[#262626] group-hover:bg-blue-500 rounded transition-colors" />
            </PanelResizeHandle>

            {/* Editor Panel */}
            <Panel defaultSize={42} minSize={25} className="flex h-full">
              <CodeEditor />
            </Panel>
            
            <PanelResizeHandle className="w-3 bg-transparent cursor-col-resize flex flex-col items-center justify-center relative group">
              <div className="absolute top-1/2 -mt-4 w-1 h-8 bg-[#262626] group-hover:bg-blue-500 rounded transition-colors" />
            </PanelResizeHandle>
            
            {/* Preview Panel */}
            <Panel defaultSize={40} minSize={20} className="flex h-full">
              <Preview />
            </Panel>
          </PanelGroup>
        </main>
      </div>
    </IdeProvider>
  );
}
