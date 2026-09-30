import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { validateAttribute, COMMON_JAVA_TYPES } from '../../utils/umlValidation';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { Plus, Save } from 'lucide-react';

const VISIBILITY_OPTIONS = [
  { value: 'private', label: '- private' },
  { value: 'public', label: '+ public' },
  { value: 'protected', label: '# protected' },
  { value: 'package', label: '~ package-private' }
];

export function AttributeModal({ isOpen, onClose, data }) {
  const classes = useUMLStore((state) => state.classes);
  const addAttribute = useUMLStore((state) => state.addAttribute);
  const updateAttribute = useUMLStore((state) => state.updateAttribute);

  const classId = data?.classId;
  const editingAttr = data?.attribute;
  const isEditing = !!editingAttr;

  const currentClass = classes.find((c) => c.id === classId);

  const isPredefined = editingAttr ? COMMON_JAVA_TYPES.includes(editingAttr.type) : true;
  const initialType = editingAttr ? (isPredefined ? editingAttr.type : 'custom') : 'String';
  const initialCustomType = editingAttr && !isPredefined ? editingAttr.type : '';

  const [name, setName] = useState(editingAttr?.name || '');
  const [type, setType] = useState(initialType);
  const [customType, setCustomType] = useState(initialCustomType);
  const [visibility, setVisibility] = useState(editingAttr?.visibility || 'private');
  const [isStatic, setIsStatic] = useState(!!editingAttr?.static);
  const [isFinal, setIsFinal] = useState(!!editingAttr?.final);
  const [error, setError] = useState('');

  if (!currentClass) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalType = type === 'custom' ? customType.trim() : type;

    const attrData = {
      name: name.trim(),
      type: finalType,
      visibility,
      static: isStatic,
      final: isFinal
    };

    const validation = validateAttribute(
      attrData,
      currentClass.attributes || [],
      editingAttr?.id
    );

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (isEditing) {
      updateAttribute(classId, editingAttr.id, attrData);
    } else {
      addAttribute(classId, attrData);
    }

    onClose();
  };

  const typeOptions = [
    ...COMMON_JAVA_TYPES.map((t) => ({ value: t, label: t })),
    { value: 'custom', label: 'Other / Custom Type...' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Attribute' : 'Add Attribute'}
      subtitle={`Class: ${currentClass.name}`}
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
            {isEditing ? 'Save Attribute' : 'Add Attribute'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Attribute Name"
          placeholder="e.g. id, title, price"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={typeOptions}
          />

          <Select
            label="Visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            options={VISIBILITY_OPTIONS}
          />
        </div>

        {type === 'custom' && (
          <Input
            label="Custom Type Name"
            placeholder="e.g. BigDecimal, ArrayList<Item>"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            required
            helperText="Specify class or interface name"
          />
        )}

        <div className="flex items-center gap-6 pt-1">
          <label className="checkbox-label cursor-pointer">
            <input
              type="checkbox"
              checked={isStatic}
              onChange={(e) => setIsStatic(e.target.checked)}
              className="form-checkbox"
            />
            <span className="text-sm font-medium">static</span>
          </label>

          <label className="checkbox-label cursor-pointer">
            <input
              type="checkbox"
              checked={isFinal}
              onChange={(e) => setIsFinal(e.target.checked)}
              className="form-checkbox"
            />
            <span className="text-sm font-medium">final (constant)</span>
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default AttributeModal;
