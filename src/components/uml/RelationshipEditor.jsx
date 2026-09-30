import { useUMLStore } from '../../store/umlStore';
import { Trash2, X, ArrowRight } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const MULTIPLICITY_OPTIONS = [
  { value: '', label: 'None' },
  { value: '1', label: '1 (One)' },
  { value: '0..1', label: '0..1 (Zero or One)' },
  { value: '*', label: '* (Many)' },
  { value: '1..*', label: '1..* (One or More)' },
  { value: '0..*', label: '0..* (Zero or More)' }
];

const RELATIONSHIP_TYPES = [
  { value: 'association', label: 'Association (Solid line)' },
  { value: 'inheritance', label: 'Inheritance (Hollow triangle arrow to parent)' },
  { value: 'dependency', label: 'Dependency (Dashed arrow to target)' }
];

export function RelationshipEditor({ relationshipId }) {
  const relationships = useUMLStore((state) => state.relationships);
  const classes = useUMLStore((state) => state.classes);
  const updateRelationship = useUMLStore((state) => state.updateRelationship);
  const deleteRelationship = useUMLStore((state) => state.deleteRelationship);
  const clearSelection = useUMLStore((state) => state.clearSelection);

  const rel = relationships.find((r) => r.id === relationshipId);

  if (!rel) {
    return (
      <div className="properties-empty">
        <p>No relationship selected</p>
      </div>
    );
  }

  const sourceClass = classes.find((c) => c.id === rel.source);
  const targetClass = classes.find((c) => c.id === rel.target);

  const handleChange = (field, value) => {
    updateRelationship(rel.id, { [field]: value });
  };

  const handleDelete = () => {
    deleteRelationship(rel.id);
  };

  return (
    <div className="properties-panel-content">
      {/* Header */}
      <div className="properties-panel-header">
        <div>
          <div className="properties-panel-badge">Relationship Inspector</div>
          <h3 className="properties-class-title capitalize">{rel.type}</h3>
        </div>
        <button
          className="action-icon-btn"
          onClick={clearSelection}
          title="Close Inspector"
          aria-label="Close inspector"
        >
          <X size={16} />
        </button>
      </div>

      <div className="properties-body">
        {/* Source -> Target Overview */}
        <div className="relation-overview-card">
          <div className="relation-party">
            <span className="party-badge">Source</span>
            <span className="party-name">{sourceClass?.name || 'Unknown'}</span>
          </div>
          <ArrowRight size={16} className="text-text-muted" />
          <div className="relation-party">
            <span className="party-badge">Target</span>
            <span className="party-name">{targetClass?.name || 'Unknown'}</span>
          </div>
        </div>

        {/* Relationship Type */}
        <Select
          label="Relationship Type"
          value={rel.type}
          onChange={(e) => handleChange('type', e.target.value)}
          options={RELATIONSHIP_TYPES}
        />

        {/* Label */}
        <Input
          label="Label (optional)"
          placeholder="e.g. contains, enrolls, manages"
          value={rel.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
          helperText="Displayed along the connector line"
        />

        {/* Multiplicities (only meaningful for association) */}
        {rel.type === 'association' && (
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Source Multiplicity"
              value={rel.sourceMultiplicity || ''}
              onChange={(e) => handleChange('sourceMultiplicity', e.target.value)}
              options={MULTIPLICITY_OPTIONS}
            />
            <Select
              label="Target Multiplicity"
              value={rel.targetMultiplicity || ''}
              onChange={(e) => handleChange('targetMultiplicity', e.target.value)}
              options={MULTIPLICITY_OPTIONS}
            />
          </div>
        )}

        {/* Delete Relationship */}
        <div className="properties-footer-actions">
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleDelete}
            className="w-full"
          >
            Delete Relationship
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RelationshipEditor;
