import { useUMLStore } from '../../store/umlStore';
import AddClassDialog from './AddClassDialog';
import EditClassDialog from './EditClassDialog';
import AttributeModal from './AttributeModal';
import MethodModal from './MethodModal';
import RelationshipModal from './RelationshipModal';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import ShortcutsDialog from './ShortcutsDialog';

export function ModalManager() {
  const modalState = useUMLStore((state) => state.modalState);
  const closeModal = useUMLStore((state) => state.closeModal);

  const { isOpen, type, data } = modalState;

  if (!isOpen || !type) return null;

  switch (type) {
    case 'addClass':
      return <AddClassDialog isOpen={isOpen} onClose={closeModal} />;
    case 'editClass':
      return <EditClassDialog key={data?.classId || 'edit-cls'} isOpen={isOpen} onClose={closeModal} data={data} />;
    case 'addAttribute':
    case 'editAttribute':
      return <AttributeModal key={data?.attribute?.id || 'attr-new'} isOpen={isOpen} onClose={closeModal} data={data} />;
    case 'addMethod':
    case 'editMethod':
      return <MethodModal key={data?.method?.id || 'mth-new'} isOpen={isOpen} onClose={closeModal} data={data} />;
    case 'addRelationship':
      return <RelationshipModal key={data?.relationship?.id || 'rel-new'} isOpen={isOpen} onClose={closeModal} data={data} />;
    case 'deleteConfirm':
      return <ConfirmDeleteDialog isOpen={isOpen} onClose={closeModal} data={data} />;
    case 'shortcuts':
      return <ShortcutsDialog isOpen={isOpen} onClose={closeModal} />;
    default:
      return null;
  }
}

export default ModalManager;
