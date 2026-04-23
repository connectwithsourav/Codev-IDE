import React, { useState, useEffect, useRef } from 'react';
import { useIde } from '../hooks/useIdeContext';
import { debounce, cn } from '../lib/utils';
import { Play, Monitor, Tablet, Smartphone } from 'lucide-react';

export function Preview() {
  const { files, viewportMode, setViewportMode } = useIde();
  const [srcDoc, setSrcDoc] = useState('');

  const generatePreview = useRef(
    debounce((currentFiles: typeof files) => {
      let htmlContent = currentFiles['index.html']?.content || '';
      let cssContent = currentFiles['styles.css']?.content || '';
      let jsContent = currentFiles['script.js']?.content || '';

      // Replace image paths with base64 data URIs
      Object.values(currentFiles).forEach((file: any) => {
        if (file.language === 'image') {
          // Replace exactly the exact filename string
          const regex = new RegExp(file.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          htmlContent = htmlContent.replace(regex, file.content);
          cssContent = cssContent.replace(regex, file.content);
          jsContent = jsContent.replace(regex, file.content);
        }
      });

      const doc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${cssContent}</style>
          </head>
          <body>
            ${htmlContent}
            <script>
              try {
                ${jsContent}
              } catch (err) {
                console.error(err);
              }
            ${'</script>'}
          </body>
        </html>
      `;
      setSrcDoc(doc);
    }, 150)
  ).current;

  useEffect(() => {
    generatePreview(files);
  }, [files, generatePreview]);

  // Determine container width and wrapper UI based on viewportMode
  const getContainerStyles = (): React.CSSProperties => {
    switch (viewportMode) {
      case 'mobile': return { width: '375px', minWidth: '375px', borderRadius: '2rem', padding: '0.5rem', background: '#000', border: '8px solid #222' };
      case 'desktop': default: return { width: '100%', minWidth: '100%' };
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#111111] rounded-2xl border border-[#262626] overflow-hidden w-full z-0">
      <div className="h-12 bg-[#161616] border-b border-[#262626] flex items-center justify-between px-4 shrink-0 font-medium">
        <div className="flex gap-1 bg-[#262626] p-0.5 rounded-lg">
          <button onClick={() => setViewportMode('desktop')} className={cn("p-1.5 rounded transition-colors", viewportMode === 'desktop' ? "bg-[#111111] text-white shadow" : "hover:bg-[#111111] text-neutral-500")} title="Desktop View">
            <Monitor size={14} />
          </button>
          <button onClick={() => setViewportMode('mobile')} className={cn("p-1.5 rounded transition-colors", viewportMode === 'mobile' ? "bg-[#111111] text-white shadow" : "hover:bg-[#111111] text-neutral-500")} title="Mobile View">
            <Smartphone size={14} />
          </button>
        </div>
        
        <div className="text-[11px] text-neutral-500 font-mono capitalize">
          {viewportMode} Size Output
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wLDBIMTBWMTBIMHptMjAsMEgzMFYxMEgyMHptLTIwLDIwaDEwVjMwaC0xMHptMjAsMGgxMFYzMGgtMTB6IiBmaWxsPSIjMWUxZTFlIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] bg-[#0f0f11] flex justify-center p-0 md:p-6 transition-all">
        <div 
          className="transition-all duration-300 transform-gpu flex items-center justify-center h-full sm:h-auto"
          style={{ ...getContainerStyles(), height: viewportMode === 'desktop' ? '100%' : '80vh' }}
        >
          <div className="w-full h-full bg-white rounded-md overflow-hidden relative shadow-2xl ring-1 ring-black/10">
            <iframe
              title="Preview Output"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border-none absolute inset-0"
              style={{ background: 'white' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
