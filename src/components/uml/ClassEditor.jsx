import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import { validateClassName } from '../../utils/umlValidation';
import AttributeEditor from './AttributeEditor';
import MethodEditor from './MethodEditor';
import Button from '../common/Button';
import { Trash2, Edit3, Check, X } from 'lucide-react';

export function ClassEditor({ classId }) {
  const classes = useUMLStore((state) => state.classes);
  const updateClass = useUMLStore((state) => state.updateClass);
  const openModal = useUMLStore((state) => state.openModal);
  const clearSelection = useUMLStore((state) => state.clearSelection);

  const currentClass = classes.find((c) => c.id === classId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(currentClass?.name || '');
  const [nameError, setNameError] = useState('');

  if (!currentClass) {
    return (
      <div className="properties-empty">
        <p>No class selected</p>
      </div>
    );
  }

  const handleStartEditing = () => {
    setNameValue(currentClass.name);
    setNameError('');
    setIsEditingName(true);
  };

  const handleSaveName = (e) => {
    e?.preventDefault();
    const validation = validateClassName(nameValue, classes, currentClass.id);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    updateClass(currentClass.id, { name: nameValue.trim() });
    setIsEditingName(false);
    setNameError('');
  };

  const handleToggleAbstract = (e) => {
    updateClass(currentClass.id, { isAbstract: e.target.checked });
  };

  const handleDeleteClass = () => {
    openModal('deleteConfirm', {
      classId: currentClass.id,
      className: currentClass.name
    });
  };

  return (
    <div className="properties-panel-content">
      {/* Header */}
      <div className="properties-panel-header">
        <div className="flex-1 min-w-0">
          <div className="properties-panel-badge">Class Inspector</div>
          {!isEditingName ? (
            <div className="flex items-center gap-2 mt-1">
              <h3 className="properties-class-title truncate" title={currentClass.name}>
                {currentClass.name}
              </h3>
              <button
                className="action-icon-btn"
                onClick={handleStartEditing}
                title="Rename Class"
              >
                <Edit3 size={14} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveName} className="mt-2 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={nameValue}
                  onChange={(e) => {
                    setNameValue(e.target.value);
                    setNameError('');
                  }}
                  autoFocus
                  className="form-input text-sm py-1 px-2"
                />
                <button
                  type="submit"
                  className="action-icon-btn success"
                  title="Save Name"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  className="action-icon-btn"
                  onClick={() => {
                    setNameValue(currentClass.name);
                    setIsEditingName(false);
                    setNameError('');
                  }}
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
              {nameError && <span className="text-xs text-danger">{nameError}</span>}
            </form>
          )}
        </div>
        <button
          className="action-icon-btn"
          onClick={clearSelection}
          title="Close Inspector"
          aria-label="Close inspector"
        >
          <X size={16} />
        </button>
      </div>

      <div className="properties-body">
        {/* Class Options */}
        <div className="property-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={!!currentClass.isAbstract}
              onChange={handleToggleAbstract}
              className="form-checkbox"
            />
            <span className="text-sm font-medium">Abstract Class</span>
          </label>
        </div>

        {/* Attributes Section */}
        <AttributeEditor
          classId={currentClass.id}
          attributes={currentClass.attributes || []}
        />

        {/* Methods Section */}
        <MethodEditor
          classId={currentClass.id}
          methods={currentClass.methods || []}
        />

        {/* Delete Class Action */}
        <div className="properties-footer-actions">
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={handleDeleteClass}
            className="w-full"
          >
            Delete Class
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClassEditor;
