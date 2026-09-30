import { useState, useRef } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { SAMPLES } from '../../utils/sampleData';
import { exportDiagramAsJSON, exportCanvasAsPNG } from '../../utils/exportUtils';
import Button from '../common/Button';
import {
  FilePlus,
  Save,
  FolderOpen,
  Download,
  Upload,
  Sun,
  Moon,
  HelpCircle,
  FileJson,
  Image as ImageIcon,
  Boxes,
  ChevronDown
} from 'lucide-react';

export function Header({ canvasContainerRef }) {
  const classes = useUMLStore((state) => state.classes);
  const relationships = useUMLStore((state) => state.relationships);
  const diagramName = useUMLStore((state) => state.diagramName);
  const theme = useUMLStore((state) => state.theme);
  const toggleTheme = useUMLStore((state) => state.toggleTheme);
  const clearDiagram = useUMLStore((state) => state.clearDiagram);
  const loadDiagram = useUMLStore((state) => state.loadDiagram);
  const saveToLocalStorage = useUMLStore((state) => state.saveToLocalStorage);
  const loadFromLocalStorage = useUMLStore((state) => state.loadFromLocalStorage);
  const openModal = useUMLStore((state) => state.openModal);
  const showToast = useUMLStore((state) => state.showToast);

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExamplesMenuOpen, setIsExamplesMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleNewDiagram = () => {
    if (classes.length > 0) {
      if (window.confirm('Create a new diagram? Any unsaved changes will be cleared.')) {
        clearDiagram();
      }
    } else {
      clearDiagram();
    }
  };

  const handleExportJSON = () => {
    exportDiagramAsJSON(classes, relationships, diagramName || 'uml-diagram');
    setIsExportMenuOpen(false);
    showToast('Exported diagram as JSON', 'success');
  };

  const handleExportPNG = async () => {
    setIsExportMenuOpen(false);
    try {
      showToast('Rendering PNG image...', 'info');
      await exportCanvasAsPNG(canvasContainerRef.current, `${(diagramName || 'uml-diagram').toLowerCase().replace(/\s+/g, '-')}.png`);
      showToast('Exported diagram as PNG', 'success');
    } catch (err) {
      console.error('PNG export failed:', err);
      showToast('Failed to export PNG image', 'error');
    }
  };

  const handleImportJSONClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.classes || !Array.isArray(parsed.classes)) {
          throw new Error('Invalid UML diagram JSON format.');
        }
        loadDiagram({
          name: parsed.diagramName || file.name.replace('.json', ''),
          classes: parsed.classes || [],
          relationships: parsed.relationships || []
        });
      } catch (err) {
        console.error('Import error:', err);
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleLoadSample = (sampleKey) => {
    const sample = SAMPLES[sampleKey];
    if (sample) {
      loadDiagram(sample);
      setIsExamplesMenuOpen(false);
    }
  };

  return (
    <header className="app-header">
      {/* Brand logo & title */}
      <div className="header-brand">
        <div className="brand-icon">
          <Boxes size={22} className="text-white" />
        </div>
        <div>
          <h1 className="brand-title">UML Class Diagram Generator</h1>
          <span className="brand-badge">React &bull; Java Engine</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* New Diagram */}
        <Button
          size="sm"
          variant="ghost"
          icon={FilePlus}
          onClick={handleNewDiagram}
          title="Create a new blank diagram"
        >
          New
        </Button>

        {/* Save to LocalStorage */}
        <Button
          size="sm"
          variant="ghost"
          icon={Save}
          onClick={saveToLocalStorage}
          title="Save diagram to local storage (Ctrl+S)"
        >
          Save
        </Button>

        {/* Load from LocalStorage */}
        <Button
          size="sm"
          variant="ghost"
          icon={FolderOpen}
          onClick={loadFromLocalStorage}
          title="Load saved diagram from local storage"
        >
          Load
        </Button>

        {/* Examples dropdown */}
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsExamplesMenuOpen(!isExamplesMenuOpen);
              setIsExportMenuOpen(false);
            }}
            title="Load sample UML diagram"
          >
            Examples <ChevronDown size={14} className="ml-1" />
          </Button>

          {isExamplesMenuOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleLoadSample('ecommerce')}
              >
                <strong>E-Commerce System</strong>
                <span className="text-xs text-text-muted">User, Product, Order, Payment</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleLoadSample('inheritance')}
              >
                <strong>Animal Hierarchy</strong>
                <span className="text-xs text-text-muted">Inheritance &amp; Abstract Classes</span>
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleLoadSample('university')}
              >
                <strong>University Management</strong>
                <span className="text-xs text-text-muted">Student, Course, Instructor</span>
              </button>
              <div className="dropdown-divider" />
              <button
                className="dropdown-item text-danger"
                onClick={() => handleLoadSample('empty')}
              >
                <strong>Empty Diagram</strong>
                <span className="text-xs text-text-muted">Blank canvas</span>
              </button>
            </div>
          )}
        </div>

        {/* Export dropdown */}
        <div className="relative">
          <Button
            size="sm"
            variant="secondary"
            icon={Download}
            onClick={() => {
              setIsExportMenuOpen(!isExportMenuOpen);
              setIsExamplesMenuOpen(false);
            }}
            title="Export diagram"
          >
            Export <ChevronDown size={14} className="ml-1" />
          </Button>

          {isExportMenuOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleExportPNG}>
                <ImageIcon size={15} />
                <span>Export as PNG Image</span>
              </button>
              <button className="dropdown-item" onClick={handleExportJSON}>
                <FileJson size={15} />
                <span>Export as JSON</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={handleImportJSONClick}>
                <Upload size={15} />
                <span>Import JSON Diagram</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden file input for importing JSON */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          style={{ display: 'none' }}
        />

        {/* Keyboard Shortcuts */}
        <button
          className="action-icon-btn"
          onClick={() => openModal('shortcuts')}
          title="Keyboard Shortcuts"
          aria-label="Keyboard shortcuts"
        >
          <HelpCircle size={18} />
        </button>

        {/* Theme Toggle */}
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

export default Header;
