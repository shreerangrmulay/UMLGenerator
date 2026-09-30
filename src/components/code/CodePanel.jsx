import { useMemo, useState, useEffect } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { generateJavaFiles } from '../../utils/codeGenerator';
import { downloadJavaFile, downloadAllJavaFilesAsZip } from '../../utils/exportUtils';
import CodeViewer from './CodeViewer';
import Button from '../common/Button';
import {
  FileCode,
  Copy,
  Download,
  Archive,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RefreshCw,
  Check
} from 'lucide-react';

export function CodePanel() {
  const classes = useUMLStore((state) => state.classes);
  const relationships = useUMLStore((state) => state.relationships);
  const isCodePanelOpen = useUMLStore((state) => state.isCodePanelOpen);
  const toggleCodePanel = useUMLStore((state) => state.toggleCodePanel);
  const activeJavaFileId = useUMLStore((state) => state.activeJavaFileId);
  const setActiveJavaFileId = useUMLStore((state) => state.setActiveJavaFileId);
  const showToast = useUMLStore((state) => state.showToast);

  const [isCopied, setIsCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [, setRefreshKey] = useState(0);

  // Generate Java files from current model
  const javaFiles = useMemo(() => {
    return generateJavaFiles({ classes, relationships });
  }, [classes, relationships]);

  // Determine active file
  const activeFile = useMemo(() => {
    if (javaFiles.length === 0) return null;
    const match = javaFiles.find((f) => f.id === activeJavaFileId);
    return match || javaFiles[0];
  }, [javaFiles, activeJavaFileId]);

  // Set active file id if not set
  useEffect(() => {
    if (javaFiles.length > 0 && !activeJavaFileId) {
      setActiveJavaFileId(javaFiles[0].id);
    }
  }, [javaFiles, activeJavaFileId, setActiveJavaFileId]);

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setIsCopied(true);
      showToast(`Copied ${activeFile.fileName} to clipboard`, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      showToast('Failed to copy code to clipboard', 'error');
    }
  };

  const handleDownloadSingle = () => {
    if (!activeFile) return;
    try {
      downloadJavaFile(activeFile.fileName, activeFile.code);
      showToast(`Downloaded ${activeFile.fileName}`, 'success');
    } catch (err) {
      console.error('Download failed:', err);
      showToast('Download failed', 'error');
    }
  };

  const handleDownloadAllZip = async () => {
    if (javaFiles.length === 0) return;
    try {
      await downloadAllJavaFilesAsZip(javaFiles, 'JavaSources.zip');
      showToast('Downloaded all Java files (JavaSources.zip)', 'success');
    } catch (err) {
      console.error('Zip download failed:', err);
      showToast('Failed to create ZIP file', 'error');
    }
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
    showToast('Java code re-generated', 'info');
  };

  if (!isCodePanelOpen) {
    return (
      <div className="code-panel-collapsed-bar" onClick={toggleCodePanel}>
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-primary" />
          <span className="font-semibold text-xs uppercase tracking-wider">
            Generated Java Code ({javaFiles.length} {javaFiles.length === 1 ? 'file' : 'files'})
          </span>
        </div>
        <button
          className="action-icon-btn"
          title="Open Java Code Panel"
          aria-label="Open Java code panel"
        >
          <ChevronUp size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={`code-panel ${isMaximized ? 'code-panel-maximized' : ''}`}>
      {/* Top Header of Code Panel */}
      <div className="code-panel-header">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 font-semibold text-xs tracking-wider uppercase text-text-primary shrink-0">
            <FileCode size={16} className="text-primary" />
            <span>Generated Java Code</span>
          </div>

          {/* File Tabs */}
          {javaFiles.length > 0 && (
            <div className="code-file-tabs">
              {javaFiles.map((file) => {
                const isActive = activeFile?.id === file.id;
                return (
                  <button
                    key={file.id}
                    className={`code-file-tab ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveJavaFileId(file.id)}
                    title={file.fileName}
                  >
                    <FileCode size={13} className={isActive ? 'text-primary' : 'text-text-muted'} />
                    <span className="truncate">{file.fileName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="code-panel-actions">
          <Button
            size="sm"
            variant="ghost"
            icon={isCopied ? Check : Copy}
            onClick={handleCopy}
            disabled={!activeFile}
            title="Copy current file code"
          >
            {isCopied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            icon={Download}
            onClick={handleDownloadSingle}
            disabled={!activeFile}
            title="Download current .java file"
          >
            Download
          </Button>

          <Button
            size="sm"
            variant="secondary"
            icon={Archive}
            onClick={handleDownloadAllZip}
            disabled={javaFiles.length === 0}
            title="Download all files in a ZIP archive"
          >
            Download All (ZIP)
          </Button>

          <button
            className="action-icon-btn"
            onClick={handleRefresh}
            title="Re-generate Java Code"
            aria-label="Re-generate Java code"
          >
            <RefreshCw size={14} />
          </button>

          <button
            className="action-icon-btn"
            onClick={() => setIsMaximized(!isMaximized)}
            title={isMaximized ? 'Restore Panel' : 'Maximize Panel'}
            aria-label={isMaximized ? 'Restore panel' : 'Maximize panel'}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button
            className="action-icon-btn"
            onClick={toggleCodePanel}
            title="Collapse Code Panel"
            aria-label="Collapse code panel"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="code-panel-body">
        {javaFiles.length === 0 ? (
          <div className="code-empty-state">
            <FileCode size={36} className="text-text-muted mb-2" />
            <p className="font-medium text-sm text-text-secondary">No Java files generated yet.</p>
            <p className="text-xs text-text-muted mt-1">
              Add classes and relationships to the UML diagram to automatically generate Java source files.
            </p>
          </div>
        ) : activeFile ? (
          <CodeViewer code={activeFile.code} fileName={activeFile.fileName} />
        ) : null}
      </div>
    </div>
  );
}

export default CodePanel;
