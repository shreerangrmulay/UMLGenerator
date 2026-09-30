import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { validateMethod, COMMON_JAVA_TYPES } from '../../utils/umlValidation';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { Plus, Save, Trash2 } from 'lucide-react';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: '+ public' },
  { value: 'private', label: '- private' },
  { value: 'protected', label: '# protected' },
  { value: 'package', label: '~ package-private' }
];

export function MethodModal({ isOpen, onClose, data }) {
  const classes = useUMLStore((state) => state.classes);
  const addMethod = useUMLStore((state) => state.addMethod);
  const updateMethod = useUMLStore((state) => state.updateMethod);

  const classId = data?.classId;
  const editingMethod = data?.method;
  const isEditing = !!editingMethod;

  const currentClass = classes.find((c) => c.id === classId);

  const isPredefined = editingMethod ? COMMON_JAVA_TYPES.includes(editingMethod.returnType) : true;
  const initialType = editingMethod ? (isPredefined ? editingMethod.returnType : 'custom') : 'void';
  const initialCustomType = editingMethod && !isPredefined ? editingMethod.returnType : '';

  const [name, setName] = useState(editingMethod?.name || '');
  const [returnType, setReturnType] = useState(initialType);
  const [customReturnType, setCustomReturnType] = useState(initialCustomType);
  const [visibility, setVisibility] = useState(editingMethod?.visibility || 'public');
  const [isStatic, setIsStatic] = useState(!!editingMethod?.static);
  const [isAbstract, setIsAbstract] = useState(!!editingMethod?.abstract);
  const [parameters, setParameters] = useState(editingMethod?.parameters ? JSON.parse(JSON.stringify(editingMethod.parameters)) : []);
  const [error, setError] = useState('');

  if (!currentClass) return null;

  const handleAddParam = () => {
    setParameters([
      ...parameters,
      { name: `param${parameters.length + 1}`, type: 'String' }
    ]);
  };

  const handleParamChange = (index, field, value) => {
    const nextParams = [...parameters];
    nextParams[index] = { ...nextParams[index], [field]: value };
    setParameters(nextParams);
    setError('');
  };

  const handleRemoveParam = (index) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReturnType = returnType === 'custom' ? customReturnType.trim() : returnType;

    const methodData = {
      name: name.trim(),
      returnType: finalReturnType,
      visibility,
      parameters,
      static: isStatic,
      abstract: isAbstract
    };

    const validation = validateMethod(
      methodData,
      currentClass.methods || [],
      editingMethod?.id
    );

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (isEditing) {
      updateMethod(classId, editingMethod.id, methodData);
    } else {
      addMethod(classId, methodData);
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
      title={isEditing ? 'Edit Method' : 'Add Method'}
      subtitle={`Class: ${currentClass.name}`}
      maxWidth="max-w-lg"
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
            {isEditing ? 'Save Method' : 'Add Method'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Method Name"
          placeholder="e.g. calculateTotal, login, getName"
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
            label="Return Type"
            value={returnType}
            onChange={(e) => setReturnType(e.target.value)}
            options={typeOptions}
          />

          <Select
            label="Visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            options={VISIBILITY_OPTIONS}
          />
        </div>

        {returnType === 'custom' && (
          <Input
            label="Custom Return Type"
            placeholder="e.g. List<Student>, Optional<User>"
            value={customReturnType}
            onChange={(e) => setCustomReturnType(e.target.value)}
            required
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
              checked={isAbstract}
              onChange={(e) => setIsAbstract(e.target.checked)}
              className="form-checkbox"
            />
            <span className="text-sm font-medium">abstract</span>
          </label>
        </div>

        {/* Parameters Section */}
        <div className="border-t border-border-subtle pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Method Parameters ({parameters.length})
            </label>
            <button
              type="button"
              onClick={handleAddParam}
              className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              <Plus size={13} /> Add Parameter
            </button>
          </div>

          {parameters.length === 0 ? (
            <p className="text-xs text-text-muted italic py-1">No parameters (0-arg method)</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {parameters.map((param, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-surface-secondary p-2 rounded-md border border-border-subtle">
                  <input
                    type="text"
                    value={param.name}
                    placeholder="Parameter name"
                    onChange={(e) => handleParamChange(idx, 'name', e.target.value)}
                    className="form-input text-xs py-1 px-2 flex-1"
                    required
                  />
                  <input
                    type="text"
                    value={param.type}
                    placeholder="Type (e.g. int, String)"
                    onChange={(e) => handleParamChange(idx, 'type', e.target.value)}
                    className="form-input text-xs py-1 px-2 flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParam(idx)}
                    className="action-icon-btn danger"
                    title="Remove parameter"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default MethodModal;
