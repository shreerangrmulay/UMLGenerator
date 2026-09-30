import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { validateClassName } from '../../utils/umlValidation';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Save } from 'lucide-react';

export function EditClassDialog({ isOpen, onClose, data }) {
  const classes = useUMLStore((state) => state.classes);
  const updateClass = useUMLStore((state) => state.updateClass);

  const classId = data?.classId;
  const currentClass = classes.find((c) => c.id === classId);

  const [name, setName] = useState(currentClass?.name || '');
  const [isAbstract, setIsAbstract] = useState(!!currentClass?.isAbstract);
  const [error, setError] = useState('');

  if (!currentClass) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateClassName(name, classes, classId);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    updateClass(classId, {
      name: name.trim(),
      isAbstract
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit UML Class"
      subtitle={`Configure basic properties for ${currentClass.name}`}
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Class Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required
          autoFocus
        />

        <label className="checkbox-label cursor-pointer">
          <input
            type="checkbox"
            checked={isAbstract}
            onChange={(e) => setIsAbstract(e.target.checked)}
            className="form-checkbox"
          />
          <span className="text-sm font-medium">Abstract Class</span>
        </label>
      </form>
    </Modal>
  );
}

export default EditClassDialog;
