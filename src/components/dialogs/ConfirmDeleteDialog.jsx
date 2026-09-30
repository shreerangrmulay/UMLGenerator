import { useUMLStore } from '../../store/umlStore';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

export function ConfirmDeleteDialog({ isOpen, onClose, data }) {
  const deleteClass = useUMLStore((state) => state.deleteClass);
  const relationships = useUMLStore((state) => state.relationships);

  const classId = data?.classId;
  const className = data?.className || 'this class';

  // Count connected relationships that will be deleted
  const connectedCount = relationships.filter(
    (r) => r.source === classId || r.target === classId
  ).length;

  const handleConfirm = () => {
    if (classId) {
      deleteClass(classId);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Class Confirmation"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" icon={Trash2} onClick={handleConfirm}>
            Delete Class
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-danger-light text-danger rounded-full shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="text-sm">
          <p className="font-medium text-text-primary mb-1">
            Are you sure you want to delete <span className="font-semibold text-danger">{className}</span>?
          </p>
          {connectedCount > 0 ? (
            <p className="text-text-secondary">
              This action will also permanently remove{' '}
              <strong className="text-danger font-semibold">
                {connectedCount} connected relationship{connectedCount > 1 ? 's' : ''}
              </strong>{' '}
              and update the generated Java source code.
            </p>
          ) : (
            <p className="text-text-secondary">
              This action cannot be undone unless you use the Undo button.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteDialog;
