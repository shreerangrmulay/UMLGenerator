import { useUMLStore } from '../../store/umlStore';
import Button from '../common/Button';
import {
  Plus,
  GitCommit,
  GitFork,
  ArrowRight,
  Trash2,
  Undo2,
  Redo2,
  LayoutGrid,
  Code2
} from 'lucide-react';

export function Toolbar() {
  const selectedElement = useUMLStore((state) => state.selectedElement);
  const history = useUMLStore((state) => state.history);
  const future = useUMLStore((state) => state.future);
  const classes = useUMLStore((state) => state.classes);

  const openModal = useUMLStore((state) => state.openModal);
  const deleteRelationship = useUMLStore((state) => state.deleteRelationship);
  const undo = useUMLStore((state) => state.undo);
  const redo = useUMLStore((state) => state.redo);
  const autoLayout = useUMLStore((state) => state.autoLayout);
  const isCodePanelOpen = useUMLStore((state) => state.isCodePanelOpen);
  const toggleCodePanel = useUMLStore((state) => state.toggleCodePanel);

  const handleDeleteSelected = () => {
    if (!selectedElement) return;

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
  };

  return (
    <div className="app-toolbar">
      {/* Creation Tools */}
      <div className="toolbar-group">
        <Button
          size="sm"
          variant="primary"
          icon={Plus}
          onClick={() => openModal('addClass')}
          title="Add a new UML Class"
        >
          Add Class
        </Button>

        <Button
          size="sm"
          variant="secondary"
          icon={GitCommit}
          onClick={() => openModal('addRelationship', { type: 'association' })}
          disabled={classes.length < 2}
          title={classes.length < 2 ? 'Requires at least 2 classes' : 'Add Association relationship'}
        >
          Association
        </Button>

        <Button
          size="sm"
          variant="secondary"
          icon={GitFork}
          onClick={() => openModal('addRelationship', { type: 'inheritance' })}
          disabled={classes.length < 2}
          title={classes.length < 2 ? 'Requires at least 2 classes' : 'Add Inheritance relationship (extends)'}
        >
          Inheritance
        </Button>

        <Button
          size="sm"
          variant="secondary"
          icon={ArrowRight}
          onClick={() => openModal('addRelationship', { type: 'dependency' })}
          disabled={classes.length < 2}
          title={classes.length < 2 ? 'Requires at least 2 classes' : 'Add Dependency relationship'}
        >
          Dependency
        </Button>
      </div>

      <div className="toolbar-separator" />

      {/* Editing & History Tools */}
      <div className="toolbar-group">
        <Button
          size="sm"
          variant="secondary"
          icon={Trash2}
          onClick={handleDeleteSelected}
          disabled={!selectedElement}
          title="Delete selected class or relationship (Delete)"
        >
          Delete Selected
        </Button>

        <Button
          size="sm"
          variant="ghost"
          icon={Undo2}
          onClick={undo}
          disabled={history.length === 0}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </Button>

        <Button
          size="sm"
          variant="ghost"
          icon={Redo2}
          onClick={redo}
          disabled={future.length === 0}
          title="Redo (Ctrl+Y)"
        >
          Redo
        </Button>

        <Button
          size="sm"
          variant="secondary"
          icon={LayoutGrid}
          onClick={() => autoLayout('TB')}
          disabled={classes.length === 0}
          title="Automatically arrange diagram layout"
        >
          Auto Layout
        </Button>
      </div>

      <div className="toolbar-spacer" />

      {/* Code Panel Toggle */}
      <div className="toolbar-group">
        <Button
          size="sm"
          variant={isCodePanelOpen ? 'primary' : 'secondary'}
          icon={Code2}
          onClick={toggleCodePanel}
          title="Toggle Generated Java Code Panel"
        >
          Java Code
        </Button>
      </div>
    </div>
  );
}

export default Toolbar;
