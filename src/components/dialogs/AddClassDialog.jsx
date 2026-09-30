import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { validateClassName } from '../../utils/umlValidation';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Plus } from 'lucide-react';

export function AddClassDialog({ isOpen, onClose }) {
  const classes = useUMLStore((state) => state.classes);
  const addClass = useUMLStore((state) => state.addClass);

  const [name, setName] = useState('');
  const [isAbstract, setIsAbstract] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateClassName(name, classes);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    addClass({
      name: name.trim(),
      isAbstract,
      attributes: [],
      methods: []
    });

    handleClose();
  };

  const handleClose = () => {
    setName('');
    setIsAbstract(false);
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New UML Class"
      subtitle="Define a new class to add to your diagram canvas"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Plus} onClick={handleSubmit}>
            Create Class
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Class Name"
          placeholder="e.g. Customer, OrderItem, Invoice"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required
          autoFocus
          helperText="Must be a valid Java class identifier (letters, digits, underscore, no spaces)."
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

export default AddClassDialog;
