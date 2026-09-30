import { useUMLStore } from '../../store/umlStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { getVisibilitySymbol } from '../../utils/umlNotation';

export function MethodEditor({ classId, methods = [] }) {
  const openModal = useUMLStore((state) => state.openModal);
  const deleteMethod = useUMLStore((state) => state.deleteMethod);

  const handleAdd = () => {
    openModal('addMethod', { classId });
  };

  const handleEdit = (method) => {
    openModal('editMethod', { classId, method });
  };

  const handleDelete = (methodId) => {
    deleteMethod(classId, methodId);
  };

  return (
    <div className="property-group">
      <div className="property-header">
        <h4 className="property-title">Methods ({methods.length})</h4>
        <Button
          size="sm"
          variant="ghost"
          icon={Plus}
          onClick={handleAdd}
          title="Add new method"
        >
          Add
        </Button>
      </div>

      <div className="property-list">
        {methods.length === 0 ? (
          <div className="property-empty">No methods defined</div>
        ) : (
          methods.map((method) => {
            const sym = getVisibilitySymbol(method.visibility);
            const paramsCount = method.parameters?.length || 0;
            return (
              <div key={method.id} className="property-item-card">
                <div className="property-item-info">
                  <span className={`vis-badge vis-${method.visibility}`}>{sym}</span>
                  <div className="property-item-text">
                    <span className="font-mono font-medium">{method.name}</span>
                    <span className="text-text-muted">
                      ({paramsCount > 0 ? `${paramsCount} param${paramsCount > 1 ? 's' : ''}` : ''}) :{' '}
                      {method.returnType || 'void'}
                    </span>
                    {method.static && <span className="tag-modifier">static</span>}
                    {method.abstract && <span className="tag-modifier">abstract</span>}
                  </div>
                </div>
                <div className="property-item-actions">
                  <button
                    className="action-icon-btn"
                    onClick={() => handleEdit(method)}
                    title="Edit Method"
                    aria-label="Edit method"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="action-icon-btn danger"
                    onClick={() => handleDelete(method.id)}
                    title="Delete Method"
                    aria-label="Delete method"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MethodEditor;
