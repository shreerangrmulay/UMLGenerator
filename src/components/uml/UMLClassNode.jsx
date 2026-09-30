import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useUMLStore } from '../../store/umlStore';
import { getVisibilitySymbol } from '../../utils/umlNotation';
import { Edit2, Trash2 } from 'lucide-react';

export function UMLClassNode({ id, data = {}, selected }) {
  const { name, attributes = [], methods = [], isAbstract } = data;
  const selectElement = useUMLStore((state) => state.selectElement);
  const openModal = useUMLStore((state) => state.openModal);

  const handleNodeClick = (e) => {
    e.stopPropagation();
    selectElement({ type: 'class', id });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    openModal('editClass', { classId: id });
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    openModal('editClass', { classId: id });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    openModal('deleteConfirm', { classId: id, className: name });
  };

  return (
    <div
      className={`uml-node-card ${selected ? 'selected' : ''}`}
      onClick={handleNodeClick}
      onDoubleClick={handleDoubleClick}
      title="Click to select, double-click to edit"
    >
      {/* React Flow Connection Handles (Top, Bottom, Left, Right) */}
      <Handle type="target" position={Position.Top} id="top-target" className="uml-handle" />
      <Handle type="source" position={Position.Top} id="top-source" className="uml-handle" />

      <Handle type="target" position={Position.Bottom} id="bottom-target" className="uml-handle" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className="uml-handle" />

      <Handle type="target" position={Position.Left} id="left-target" className="uml-handle" />
      <Handle type="source" position={Position.Left} id="left-source" className="uml-handle" />

      <Handle type="target" position={Position.Right} id="right-target" className="uml-handle" />
      <Handle type="source" position={Position.Right} id="right-source" className="uml-handle" />

      {/* SECTION 1: Class Name Header */}
      <div className="uml-node-header">
        {isAbstract && <div className="uml-stereotype">&laquo;abstract&raquo;</div>}
        <div className={`uml-node-title ${isAbstract ? 'italic' : ''}`}>{name || 'UnnamedClass'}</div>

        {/* Quick action buttons on selection */}
        {selected && (
          <div className="uml-node-quick-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="uml-quick-btn"
              onClick={handleEditClick}
              title="Edit Class"
              aria-label="Edit class"
            >
              <Edit2 size={12} />
            </button>
            <button
              className="uml-quick-btn danger"
              onClick={handleDeleteClick}
              title="Delete Class"
              aria-label="Delete class"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: Attributes */}
      <div className="uml-node-section uml-node-attributes">
        {attributes && attributes.length > 0 ? (
          attributes.map((attr) => {
            const sym = getVisibilitySymbol(attr.visibility);
            return (
              <div
                key={attr.id}
                className={`uml-item-row ${attr.static ? 'uml-static' : ''}`}
                title={`${attr.visibility} ${attr.type} ${attr.name}${attr.static ? ' (static)' : ''}${attr.final ? ' (final)' : ''}`}
              >
                <span className={`uml-visibility vis-${attr.visibility}`}>{sym}</span>
                <span className="uml-item-name">{attr.name}</span>
                <span className="uml-separator">:</span>
                <span className="uml-item-type">{attr.type}</span>
                {attr.final && <span className="uml-tag">const</span>}
              </div>
            );
          })
        ) : (
          <div className="uml-empty-row">(no attributes)</div>
        )}
      </div>

      {/* SECTION 3: Methods */}
      <div className="uml-node-section uml-node-methods">
        {methods && methods.length > 0 ? (
          methods.map((method) => {
            const sym = getVisibilitySymbol(method.visibility);
            const paramsStr = (method.parameters || [])
              .map((p) => `${p.name}: ${p.type}`)
              .join(', ');

            return (
              <div
                key={method.id}
                className={`uml-item-row ${method.static ? 'uml-static' : ''} ${method.abstract ? 'uml-abstract' : ''}`}
                title={`${method.visibility} ${method.returnType} ${method.name}(${paramsStr})${method.static ? ' (static)' : ''}${method.abstract ? ' (abstract)' : ''}`}
              >
                <span className={`uml-visibility vis-${method.visibility}`}>{sym}</span>
                <span className="uml-item-name">{method.name}</span>
                <span className="uml-method-params">({paramsStr})</span>
                <span className="uml-separator">:</span>
                <span className="uml-item-type">{method.returnType || 'void'}</span>
              </div>
            );
          })
        ) : (
          <div className="uml-empty-row">(no methods)</div>
        )}
      </div>
    </div>
  );
}

export default memo(UMLClassNode);
