import { useEffect, useRef, useState } from 'react';
import { useUMLStore } from './store/umlStore';
import Header from './components/layout/Header';
import Toolbar from './components/layout/Toolbar';
import Sidebar from './components/layout/Sidebar';
import PropertiesPanel from './components/layout/PropertiesPanel';
import UMLCanvas from './components/uml/UMLCanvas';
import CodePanel from './components/code/CodePanel';
import ModalManager from './components/dialogs/ModalManager';
import Toast from './components/common/Toast';
import './App.css';

export function App() {
  const canvasRef = useRef(null);
  const theme = useUMLStore((state) => state.theme);
  const selectedElement = useUMLStore((state) => state.selectedElement);
  const classes = useUMLStore((state) => state.classes);
  const deleteRelationship = useUMLStore((state) => state.deleteRelationship);
  const clearSelection = useUMLStore((state) => state.clearSelection);
  const undo = useUMLStore((state) => state.undo);
  const redo = useUMLStore((state) => state.redo);
  const saveToLocalStorage = useUMLStore((state) => state.saveToLocalStorage);
  const openModal = useUMLStore((state) => state.openModal);
  const modalState = useUMLStore((state) => state.modalState);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Apply theme attribute to html document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs or textareas
      const targetTag = e.target.tagName?.toLowerCase();
      const isInput = targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select';

      // 1. Save (Ctrl+S / Cmd+S)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveToLocalStorage();
        return;
      }

      // If typing in input, allow normal typing
      if (isInput) return;

      // 2. Undo (Ctrl+Z / Cmd+Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // 3. Redo (Ctrl+Y / Cmd+Y or Ctrl+Shift+Z)
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // 4. Delete / Backspace (Delete selected element)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement && !modalState.isOpen) {
          e.preventDefault();
          if (selectedElement.type === 'class') {
            const cls = classes.find((c) => c.id === selectedElement.id);
            if (cls) {
              openModal('deleteConfirm', {
                classId: cls.id,
                className: cls.name
              });
            }
          } else if (selectedElement.type === 'relationship') {
            deleteRelationship(selectedElement.id);
          }
        }
        return;
      }

      // 5. Escape (Deselect element)
      if (e.key === 'Escape') {
        if (!modalState.isOpen && selectedElement) {
          clearSelection();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElement,
    classes,
    modalState.isOpen,
    undo,
    redo,
    deleteRelationship,
    clearSelection,
    saveToLocalStorage,
    openModal
  ]);

  return (
    <div className="app-root">
      {/* Top Header */}
      <Header canvasContainerRef={canvasRef} />

      {/* Action Toolbar */}
      <Toolbar />

      {/* Main Workspace Area */}
      <div className="app-main-area">
        {/* Left Elements Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Diagram Canvas */}
        <div className="canvas-work-area">
          <UMLCanvas canvasRef={canvasRef} />
        </div>

        {/* Right Properties Inspector */}
        <PropertiesPanel />
      </div>

      {/* Bottom Generated Java Code Panel */}
      <CodePanel />

      {/* Global Modals & Dialogs */}
      <ModalManager />

      {/* Toast Notification */}
      <Toast />
    </div>
  );
}

export default App;
