import { useState } from 'react';
import { useUMLStore } from '../../store/umlStore';
import {
  Boxes,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  GitCommit,
  GitFork,
  ArrowRight,
  Trash2,
  Edit2
} from 'lucide-react';
import Button from '../common/Button';

export function Sidebar({ isCollapsed, onToggleCollapse }) {
  const classes = useUMLStore((state) => state.classes);
  const relationships = useUMLStore((state) => state.relationships);
  const selectedElement = useUMLStore((state) => state.selectedElement);
  const selectElement = useUMLStore((state) => state.selectElement);
  const openModal = useUMLStore((state) => state.openModal);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRelationshipIcon = (type) => {
    switch (type) {
      case 'inheritance':
        return <GitFork size={13} className="text-primary shrink-0" />;
      case 'dependency':
        return <ArrowRight size={13} className="text-warning shrink-0" />;
      case 'association':
      default:
        return <GitCommit size={13} className="text-success shrink-0" />;
    }
  };

  const getClassName = (id) => {
    const found = classes.find((c) => c.id === id);
    return found ? found.name : 'Unknown';
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-2">
          <Boxes size={18} className="text-primary" />
          <h2 className="sidebar-title">Diagram Elements</h2>
        </div>
        <button
          className="action-icon-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="sidebar-content">
          {/* Quick Add Class Button */}
          <div className="p-3 border-b border-border-subtle">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => openModal('addClass')}
              className="w-full"
            >
              Add New Class
            </Button>
          </div>

          {/* Search Classes */}
          {classes.length > 3 && (
            <div className="px-3 pt-2.5 pb-1">
              <div className="relative">
                <Search size={14} className="sidebar-search-icon" />
                <input
                  type="text"
                  placeholder="Filter classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sidebar-search-input"
                />
              </div>
            </div>
          )}

          {/* Classes Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">Classes ({classes.length})</span>
            </div>

            <div className="sidebar-list">
              {filteredClasses.length === 0 ? (
                <div className="sidebar-empty">
                  {searchQuery ? 'No matching classes' : 'No classes yet'}
                </div>
              ) : (
                filteredClasses.map((cls) => {
                  const isSelected =
                    selectedElement?.type === 'class' && selectedElement?.id === cls.id;
                  const attrCount = cls.attributes?.length || 0;
                  const methodCount = cls.methods?.length || 0;

                  return (
                    <div
                      key={cls.id}
                      className={`sidebar-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => selectElement({ type: 'class', id: cls.id })}
                    >
                      <div className="sidebar-item-content">
                        <span className="font-semibold text-xs tracking-tight text-text-primary">
                          {cls.name}
                        </span>
                        <span className="sidebar-item-sub">
                          {attrCount} attrs &bull; {methodCount} methods
                        </span>
                      </div>
                      <div className="sidebar-item-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-icon-btn"
                          onClick={() => openModal('editClass', { classId: cls.id })}
                          title="Edit Class"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="action-icon-btn danger"
                          onClick={() =>
                            openModal('deleteConfirm', {
                              classId: cls.id,
                              className: cls.name
                            })
                          }
                          title="Delete Class"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Relationships Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="sidebar-section-title">Relationships ({relationships.length})</span>
              <button
                className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                onClick={() => openModal('addRelationship')}
                disabled={classes.length < 2}
              >
                <Plus size={12} /> Add
              </button>
            </div>

            <div className="sidebar-list">
              {relationships.length === 0 ? (
                <div className="sidebar-empty">No relationships defined</div>
              ) : (
                relationships.map((rel) => {
                  const isSelected =
                    selectedElement?.type === 'relationship' &&
                    selectedElement?.id === rel.id;
                  const srcName = getClassName(rel.source);
                  const tgtName = getClassName(rel.target);

                  return (
                    <div
                      key={rel.id}
                      className={`sidebar-item ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        selectElement({ type: 'relationship', id: rel.id })
                      }
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getRelationshipIcon(rel.type)}
                        <span className="truncate text-xs font-medium">
                          {srcName} &rarr; {tgtName}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-mono text-text-muted shrink-0">
                        {rel.type.slice(0, 5)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
