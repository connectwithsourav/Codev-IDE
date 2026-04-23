import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FilesRecord } from '../types';

export const generateSingleHtml = (files: FilesRecord): string => {
  const htmlContent = files['index.html']?.content || '';
  const cssContent = files['styles.css']?.content || '';
  const jsContent = files['script.js']?.content || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Web IDE Project</title>
  <style>
${cssContent}
  </style>
</head>
<body>
${htmlContent}
  <script>
${jsContent}
  </script>
</body>
</html>`;
};

export const downloadSingleHtml = (files: FilesRecord) => {
  const content = generateSingleHtml(files);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  saveAs(blob, 'project.html');
};

export const downloadZip = async (files: FilesRecord) => {
  const zip = new JSZip();
  Object.values(files).forEach((f) => {
    zip.file(f.name, f.content);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'project.zip');
};

export const parseUploadedFile = async (file: File): Promise<FilesRecord | null> => {
  try {
    if (file.name.endsWith('.zip')) {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const newFiles: FilesRecord = {};
      
      // Look for html, css, js in the root or inner folders
      for (const [path, fileObj] of Object.entries(contents.files)) {
        if (!fileObj.dir) {
          if (path.endsWith('.html') && !newFiles['index.html']) {
            newFiles['index.html'] = { name: 'index.html', language: 'html', content: await fileObj.async('text') };
          } else if (path.endsWith('.css') && !newFiles['styles.css']) {
            newFiles['styles.css'] = { name: 'styles.css', language: 'css', content: await fileObj.async('text') };
          } else if (path.endsWith('.js') && !newFiles['script.js']) {
            newFiles['script.js'] = { name: 'script.js', language: 'javascript', content: await fileObj.async('text') };
          }
        }
      }
      return newFiles;
    } else if (file.name.endsWith('.html')) {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      const styles = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML).join('\n');
      doc.querySelectorAll('style').forEach(s => s.remove());
      
      const scripts = Array.from(doc.querySelectorAll('script')).map(s => s.innerHTML).join('\n');
      doc.querySelectorAll('script').forEach(s => s.remove());
      
      const htmlContent = doc.body.innerHTML;
      
      return {
        'index.html': { name: 'index.html', language: 'html', content: htmlContent.trim() },
        'styles.css': { name: 'styles.css', language: 'css', content: styles.trim() },
        'script.js': { name: 'script.js', language: 'javascript', content: scripts.trim() },
      };
    }
  } catch (err) {
    console.error('Error parsing file:', err);
  }
  return null;
};
