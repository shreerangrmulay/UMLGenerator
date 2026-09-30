import { useUMLStore } from '../../store/umlStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { getVisibilitySymbol } from '../../utils/umlNotation';

export function AttributeEditor({ classId, attributes = [] }) {
  const openModal = useUMLStore((state) => state.openModal);
  const deleteAttribute = useUMLStore((state) => state.deleteAttribute);

  const handleAdd = () => {
    openModal('addAttribute', { classId });
  };

  const handleEdit = (attr) => {
    openModal('editAttribute', { classId, attribute: attr });
  };

  const handleDelete = (attrId) => {
    deleteAttribute(classId, attrId);
  };

  return (
    <div className="property-group">
      <div className="property-header">
        <h4 className="property-title">Attributes ({attributes.length})</h4>
        <Button
          size="sm"
          variant="ghost"
          icon={Plus}
          onClick={handleAdd}
          title="Add new attribute"
        >
          Add
        </Button>
      </div>

      <div className="property-list">
        {attributes.length === 0 ? (
          <div className="property-empty">No attributes defined</div>
        ) : (
          attributes.map((attr) => {
            const sym = getVisibilitySymbol(attr.visibility);
            return (
              <div key={attr.id} className="property-item-card">
                <div className="property-item-info">
                  <span className={`vis-badge vis-${attr.visibility}`}>{sym}</span>
                  <div className="property-item-text">
                    <span className="font-mono font-medium">{attr.name}</span>
                    <span className="text-text-muted">: {attr.type}</span>
                    {attr.static && <span className="tag-modifier">static</span>}
                    {attr.final && <span className="tag-modifier">final</span>}
                  </div>
                </div>
                <div className="property-item-actions">
                  <button
                    className="action-icon-btn"
                    onClick={() => handleEdit(attr)}
                    title="Edit Attribute"
                    aria-label="Edit attribute"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    className="action-icon-btn danger"
                    onClick={() => handleDelete(attr.id)}
                    title="Delete Attribute"
                    aria-label="Delete attribute"
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

export default AttributeEditor;
