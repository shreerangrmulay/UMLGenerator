import { useUMLStore } from '../../store/umlStore';
import ClassEditor from '../uml/ClassEditor';
import RelationshipEditor from '../uml/RelationshipEditor';
import { Sliders, Info, Plus, GitCommit } from 'lucide-react';
import Button from '../common/Button';

export function PropertiesPanel() {
  const selectedElement = useUMLStore((state) => state.selectedElement);
  const classes = useUMLStore((state) => state.classes);
  const relationships = useUMLStore((state) => state.relationships);
  const openModal = useUMLStore((state) => state.openModal);

  if (selectedElement?.type === 'class') {
    return (
      <div className="properties-panel">
        <ClassEditor key={selectedElement.id} classId={selectedElement.id} />
      </div>
    );
  }

  if (selectedElement?.type === 'relationship') {
    return (
      <div className="properties-panel">
        <RelationshipEditor key={selectedElement.id} relationshipId={selectedElement.id} />
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <div className="properties-panel-content">
        <div className="properties-panel-header">
          <div>
            <div className="properties-panel-badge">Overview</div>
            <h3 className="properties-class-title">Diagram Properties</h3>
          </div>
          <Sliders size={16} className="text-text-muted" />
        </div>

        <div className="properties-body">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="stat-card">
              <span className="stat-label">Total Classes</span>
              <span className="stat-value">{classes.length}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Relationships</span>
              <span className="stat-value">{relationships.length}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="property-group mt-2">
            <h4 className="property-title mb-2">Quick Actions</h4>
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => openModal('addClass')}
                className="w-full justify-start"
              >
                Add New Class
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={GitCommit}
                onClick={() => openModal('addRelationship')}
                disabled={classes.length < 2}
                className="w-full justify-start"
              >
                Add Relationship
              </Button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="info-tip-card">
            <div className="flex items-center gap-1.5 font-medium text-xs text-primary mb-1">
              <Info size={14} />
              <span>Interactive UML Modeling Tips</span>
            </div>
            <ul className="text-xs text-text-secondary flex flex-col gap-1.5 list-disc pl-4 mt-2">
              <li>Click any class or relationship to inspect and modify properties.</li>
              <li>Drag from the round handles on any class border to connect relationships.</li>
              <li>Double-click a class node to quickly edit its name and options.</li>
              <li>Use the Java Code panel below to copy or export production-ready Java source files.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;
