import { create } from 'zustand';
import { defaultDiagram } from '../data/defaultDiagram';
import { getAutoLayoutedElements } from '../utils/layoutUtils';

const STORAGE_KEY = 'uml-class-diagram';
const THEME_KEY = 'uml-theme-preference';
const MAX_HISTORY = 30;

// Helper to snapshot diagram state for undo/redo
function createSnapshot(state) {
  return {
    classes: JSON.parse(JSON.stringify(state.classes)),
    relationships: JSON.parse(JSON.stringify(state.relationships))
  };
}

export const useUMLStore = create((set, get) => ({
  // Core diagram data
  diagramName: 'E-Commerce System',
  classes: defaultDiagram.classes || [],
  relationships: defaultDiagram.relationships || [],
  
  // Selection
  selectedElement: null, // { type: 'class' | 'relationship', id: string } | null

  // Undo / Redo stacks
  history: [],
  future: [],

  // UI state
  theme: localStorage.getItem(THEME_KEY) || 'dark',
  isCodePanelOpen: true,
  codePanelHeight: 280,
  activeJavaFileId: null,

  // Dialog & Modal state triggers
  modalState: {
    isOpen: false,
    type: null, // 'addClass' | 'editClass' | 'addAttribute' | 'editAttribute' | 'addMethod' | 'editMethod' | 'addRelationship' | 'deleteConfirm' | 'shortcuts'
    data: null
  },

  // Notification / Toast
  toast: null,

  // Toast actions
  showToast: (message, type = 'info', duration = 3000) => {
    set({ toast: { id: Date.now(), message, type, duration } });
  },

  clearToast: () => {
    set({ toast: null });
  },

  // Modal actions
  openModal: (type, data = null) => {
    set({ modalState: { isOpen: true, type, data } });
  },

  closeModal: () => {
    set({ modalState: { isOpen: false, type: null, data: null } });
  },

  // Theme actions
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  // Code Panel
  toggleCodePanel: () => {
    set((state) => ({ isCodePanelOpen: !state.isCodePanelOpen }));
  },

  setCodePanelOpen: (isOpen) => {
    set({ isCodePanelOpen: isOpen });
  },

  setCodePanelHeight: (height) => {
    set({ codePanelHeight: Math.max(160, Math.min(600, height)) });
  },

  setActiveJavaFileId: (id) => {
    set({ activeJavaFileId: id });
  },

  // Push state to history before mutation
  pushHistory: () => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      history: [...state.history.slice(-MAX_HISTORY + 1), currentSnapshot],
      future: [] // Clear redo stack on new action
    }));
  },

  // Selection
  selectElement: (element) => {
    set({ selectedElement: element });
  },

  clearSelection: () => {
    set({ selectedElement: null });
  },

  // Class Actions
  addClass: (classData) => {
    get().pushHistory();
    const newId = classData.id || `cls-${Date.now()}`;
    const newClass = {
      id: newId,
      name: classData.name.trim(),
      position: classData.position || {
        x: 100 + (get().classes.length * 40) % 400,
        y: 100 + (get().classes.length * 40) % 300
      },
      isAbstract: !!classData.isAbstract,
      attributes: classData.attributes || [],
      methods: classData.methods || []
    };

    set((state) => ({
      classes: [...state.classes, newClass],
      selectedElement: { type: 'class', id: newId },
      activeJavaFileId: newId
    }));

    get().showToast(`Class "${newClass.name}" created`, 'success');
  },

  updateClass: (classId, updates) => {
    get().pushHistory();
    set((state) => ({
      classes: state.classes.map((c) => (c.id === classId ? { ...c, ...updates } : c))
    }));
    get().showToast('Class updated', 'success');
  },

  deleteClass: (classId) => {
    const cls = get().classes.find((c) => c.id === classId);
    if (!cls) return;

    get().pushHistory();
    
    // Remove class and all connected relationships
    set((state) => {
      const remainingClasses = state.classes.filter((c) => c.id !== classId);
      const remainingRelationships = state.relationships.filter(
        (rel) => rel.source !== classId && rel.target !== classId
      );
      const isSelected = state.selectedElement?.id === classId;

      return {
        classes: remainingClasses,
        relationships: remainingRelationships,
        selectedElement: isSelected ? null : state.selectedElement,
        activeJavaFileId: remainingClasses[0]?.id || null
      };
    });

    get().showToast(`Deleted class "${cls.name}"`, 'info');
  },

  // Attribute Actions
  addAttribute: (classId, attributeData) => {
    get().pushHistory();
    const newAttr = {
      id: attributeData.id || `attr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: attributeData.name.trim(),
      type: attributeData.type.trim(),
      visibility: attributeData.visibility || 'private',
      static: !!attributeData.static,
      final: !!attributeData.final
    };

    set((state) => ({
      classes: state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          attributes: [...(cls.attributes || []), newAttr]
        };
      })
    }));

    get().showToast(`Attribute "${newAttr.name}" added`, 'success');
  },

  updateAttribute: (classId, attrId, updates) => {
    get().pushHistory();
    set((state) => ({
      classes: state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          attributes: (cls.attributes || []).map((a) =>
            a.id === attrId ? { ...a, ...updates } : a
          )
        };
      })
    }));
    get().showToast('Attribute updated', 'success');
  },

  deleteAttribute: (classId, attrId) => {
    get().pushHistory();
    set((state) => ({
      classes: state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          attributes: (cls.attributes || []).filter((a) => a.id !== attrId)
        };
      })
    }));
    get().showToast('Attribute removed', 'info');
  },

  // Method Actions
  addMethod: (classId, methodData) => {
    get().pushHistory();
    const newMethod = {
      id: methodData.id || `mth-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: methodData.name.trim(),
      returnType: methodData.returnType.trim(),
      visibility: methodData.visibility || 'public',
      parameters: methodData.parameters || [],
      static: !!methodData.static,
      abstract: !!methodData.abstract
    };

    set((state) => ({
      classes: state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          methods: [...(cls.methods || []), newMethod]
        };
      })
    }));

    get().showToast(`Method "${newMethod.name}()" added`, 'success');
  },

  updateMethod: (classId, methodId, updates) => {
    get().pushHistory();
    set((state) => ({
      classes: state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          methods: (cls.methods || []).map((m) =>
            m.id === methodId ? { ...m, ...updates } : m
          )
        };
      })
    }));
    get().showToast('Method updated', 'success');
  },

  deleteMethod: (classId, methodId) => {
    get().pushHistory();
    set((state) => ({
      classes: state.classes.map((cls) => {
        if (cls.id !== classId) return cls;
        return {
          ...cls,
          methods: (cls.methods || []).filter((m) => m.id !== methodId)
        };
      })
    }));
    get().showToast('Method removed', 'info');
  },

  // Relationship Actions
  addRelationship: (relData) => {
    get().pushHistory();
    const newRel = {
      id: relData.id || `rel-${Date.now()}`,
      source: relData.source,
      target: relData.target,
      type: relData.type || 'association',
      label: relData.label ? relData.label.trim() : '',
      sourceMultiplicity: relData.sourceMultiplicity || '',
      targetMultiplicity: relData.targetMultiplicity || ''
    };

    set((state) => ({
      relationships: [...state.relationships, newRel],
      selectedElement: { type: 'relationship', id: newRel.id }
    }));

    get().showToast(`Relationship created (${newRel.type})`, 'success');
  },

  updateRelationship: (relId, updates) => {
    get().pushHistory();
    set((state) => ({
      relationships: state.relationships.map((rel) =>
        rel.id === relId ? { ...rel, ...updates } : rel
      )
    }));
    get().showToast('Relationship updated', 'success');
  },

  deleteRelationship: (relId) => {
    get().pushHistory();
    set((state) => ({
      relationships: state.relationships.filter((rel) => rel.id !== relId),
      selectedElement: state.selectedElement?.id === relId ? null : state.selectedElement
    }));
    get().showToast('Relationship deleted', 'info');
  },

  // Node position update from canvas drag
  updateNodePosition: (classId, position) => {
    set((state) => ({
      classes: state.classes.map((cls) =>
        cls.id === classId ? { ...cls, position } : cls
      )
    }));
  },

  // Finished moving node: record history point
  recordNodeMoveHistory: () => {
    get().pushHistory();
  },

  // Auto Layout
  autoLayout: (direction = 'TB') => {
    get().pushHistory();
    const { classes } = getAutoLayoutedElements(get().classes, get().relationships, direction);
    set({ classes });
    get().showToast('Auto layout applied', 'info');
  },

  // Undo / Redo
  undo: () => {
    const { history, future, classes, relationships } = get();
    if (history.length === 0) return;

    const previousSnapshot = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const currentSnapshot = { classes, relationships };

    set({
      classes: previousSnapshot.classes,
      relationships: previousSnapshot.relationships,
      history: newHistory,
      future: [currentSnapshot, ...future],
      selectedElement: null
    });

    get().showToast('Undo', 'info');
  },

  redo: () => {
    const { history, future, classes, relationships } = get();
    if (future.length === 0) return;

    const nextSnapshot = future[0];
    const newFuture = future.slice(1);
    const currentSnapshot = { classes, relationships };

    set({
      classes: nextSnapshot.classes,
      relationships: nextSnapshot.relationships,
      history: [...history, currentSnapshot],
      future: newFuture,
      selectedElement: null
    });

    get().showToast('Redo', 'info');
  },

  // Clear / Reset Diagram
  clearDiagram: () => {
    get().pushHistory();
    set({
      classes: [],
      relationships: [],
      selectedElement: null,
      activeJavaFileId: null
    });
    get().showToast('Diagram cleared', 'info');
  },

  // Load Diagram
  loadDiagram: (diagramData) => {
    get().pushHistory();
    set({
      diagramName: diagramData.name || 'Imported Diagram',
      classes: diagramData.classes || [],
      relationships: diagramData.relationships || [],
      selectedElement: null,
      activeJavaFileId: diagramData.classes?.[0]?.id || null
    });
    get().showToast(`Loaded diagram: ${diagramData.name || 'Custom'}`, 'success');
  },

  // Local Storage Save
  saveToLocalStorage: () => {
    try {
      const data = {
        diagramName: get().diagramName,
        classes: get().classes,
        relationships: get().relationships,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      get().showToast('Diagram saved to local storage', 'success');
    } catch (err) {
      console.error('Save failed:', err);
      get().showToast('Failed to save to local storage', 'error');
    }
  },

  // Local Storage Load
  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        get().showToast('No saved diagram found in local storage', 'warning');
        return false;
      }
      const data = JSON.parse(saved);
      get().loadDiagram(data);
      get().showToast('Loaded diagram from local storage', 'success');
      return true;
    } catch (err) {
      console.error('Load failed:', err);
      get().showToast('Failed to load saved diagram', 'error');
      return false;
    }
  }
}));
