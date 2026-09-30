import { Suspense } from 'react';
import Editor from '@monaco-editor/react';
import { useUMLStore } from '../../store/umlStore';
import { Code2 } from 'lucide-react';

export function CodeViewer({ code }) {
  const theme = useUMLStore((state) => state.theme);

  return (
    <div className="code-viewer-container">
      <Suspense
        fallback={
          <div className="code-viewer-loading">
            <Code2 size={24} className="animate-spin text-primary" />
            <span>Loading Code Editor...</span>
          </div>
        }
      >
        <Editor
          height="100%"
          language="java"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          options={{
            readOnly: true,
            domReadOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 }
          }}
          loading={
            <div className="code-viewer-loading">
              <Code2 size={24} className="animate-spin text-primary" />
              <span>Loading Java Editor...</span>
            </div>
          }
        />
      </Suspense>
    </div>
  );
}

export default CodeViewer;
