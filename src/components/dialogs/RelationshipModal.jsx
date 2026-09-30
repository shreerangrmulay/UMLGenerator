import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { validateRelationship } from '../../utils/umlValidation';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { Plus, Save } from 'lucide-react';

const RELATIONSHIP_TYPES = [
  { value: 'association', label: 'Association (Solid line)' },
  { value: 'inheritance', label: 'Inheritance (Hollow triangle pointing to parent)' },
  { value: 'dependency', label: 'Dependency (Dashed arrow pointing to target)' }
];

const MULTIPLICITY_OPTIONS = [
  { value: '', label: 'None' },
  { value: '1', label: '1 (One)' },
  { value: '0..1', label: '0..1 (Zero or One)' },
  { value: '*', label: '* (Many)' },
  { value: '1..*', label: '1..* (One or More)' },
  { value: '0..*', label: '0..* (Zero or More)' }
];

export function RelationshipModal({ isOpen, onClose, data }) {
  const classes = useUMLStore((state) => state.classes);
  const relationships = useUMLStore((state) => state.relationships);
  const addRelationship = useUMLStore((state) => state.addRelationship);
  const updateRelationship = useUMLStore((state) => state.updateRelationship);

  const editingRel = data?.relationship;
  const isEditing = !!editingRel;

  const defaultSource = data?.source || (classes.length > 0 ? classes[0].id : '');
  const defaultTarget = data?.target || (classes.length > 1 ? classes[1].id : classes[0]?.id || '');

  const [type, setType] = useState(editingRel?.type || data?.type || 'association');
  const [source, setSource] = useState(editingRel?.source || defaultSource);
  const [target, setTarget] = useState(editingRel?.target || defaultTarget);
  const [label, setLabel] = useState(editingRel?.label || '');
  const [sourceMultiplicity, setSourceMultiplicity] = useState(
    editingRel ? (editingRel.sourceMultiplicity || '') : '1'
  );
  const [targetMultiplicity, setTargetMultiplicity] = useState(
    editingRel ? (editingRel.targetMultiplicity || '') : '*'
  );
  const [error, setError] = useState('');

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: c.name
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const relData = {
      type,
      source,
      target,
      label: label.trim(),
      sourceMultiplicity: type === 'association' ? sourceMultiplicity : '',
      targetMultiplicity: type === 'association' ? targetMultiplicity : ''
    };

    const validation = validateRelationship(relData, relationships, editingRel?.id);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (isEditing) {
      updateRelationship(editingRel.id, relData);
    } else {
      addRelationship(relData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Relationship' : 'Create Relationship'}
      subtitle="Connect UML classes with Associations, Inheritance, or Dependencies"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={isEditing ? Save : Plus}
            onClick={handleSubmit}
          >
            {isEditing ? 'Save Relationship' : 'Create Relationship'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-2.5 bg-danger-light text-danger text-sm rounded-md border border-danger/20">
            {error}
          </div>
        )}

        <Select
          label="Relationship Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={RELATIONSHIP_TYPES}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label={type === 'inheritance' ? 'Child Class (Subclass)' : 'Source Class'}
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setError('');
            }}
            options={classOptions}
            required
          />

          <Select
            label={type === 'inheritance' ? 'Parent Class (Superclass)' : 'Target Class'}
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              setError('');
            }}
            options={classOptions}
            required
          />
        </div>

        <Input
          label="Label (optional)"
          placeholder="e.g. manages, contains, places"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          helperText="Descriptive label shown on the connector"
        />

        {type === 'association' && (
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Source Multiplicity"
              value={sourceMultiplicity}
              onChange={(e) => setSourceMultiplicity(e.target.value)}
              options={MULTIPLICITY_OPTIONS}
            />

            <Select
              label="Target Multiplicity"
              value={targetMultiplicity}
              onChange={(e) => setTargetMultiplicity(e.target.value)}
              options={MULTIPLICITY_OPTIONS}
            />
          </div>
        )}

        {type === 'inheritance' && (
          <p className="text-xs text-text-muted italic bg-surface-secondary p-2.5 rounded border border-border-subtle">
            In Java code generation: <code className="font-mono text-primary">{classes.find(c => c.id === source)?.name || 'Child'} extends {classes.find(c => c.id === target)?.name || 'Parent'}</code>. The triangular arrowhead points to the superclass.
          </p>
        )}
      </form>
    </Modal>
  );
}

export default RelationshipModal;
