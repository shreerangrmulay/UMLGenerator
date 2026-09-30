import { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useUMLStore } from '../../store/umlStore';
import UMLClassNode from './UMLClassNode';
import RelationshipEdge from './RelationshipEdge';
import { Plus, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const nodeTypes = {
  umlClass: UMLClassNode
};

const edgeTypes = {
  umlEdge: RelationshipEdge
};

export function UMLCanvas({ canvasRef }) {
  const classes = useUMLStore((state) => state.classes);
  const relationships = useUMLStore((state) => state.relationships);
  const selectedElement = useUMLStore((state) => state.selectedElement);
  const selectElement = useUMLStore((state) => state.selectElement);
  const clearSelection = useUMLStore((state) => state.clearSelection);
  const updateNodePosition = useUMLStore((state) => state.updateNodePosition);
  const recordNodeMoveHistory = useUMLStore((state) => state.recordNodeMoveHistory);
  const openModal = useUMLStore((state) => state.openModal);
  const theme = useUMLStore((state) => state.theme);

  // Convert store classes to React Flow nodes
  const nodes = useMemo(() => {
    return classes.map((cls) => ({
      id: cls.id,
      type: 'umlClass',
      position: cls.position || { x: 100, y: 100 },
      data: cls,
      selected: selectedElement?.type === 'class' && selectedElement?.id === cls.id
    }));
  }, [classes, selectedElement]);

  // Convert store relationships to React Flow edges
  const edges = useMemo(() => {
    return relationships.map((rel) => ({
      id: rel.id,
      source: rel.source,
      target: rel.target,
      type: 'umlEdge',
      data: rel,
      selected: selectedElement?.type === 'relationship' && selectedElement?.id === rel.id
    }));
  }, [relationships, selectedElement]);

  // Handle node drag stop
  const onNodeDragStop = useCallback(
    (event, node) => {
      updateNodePosition(node.id, node.position);
      recordNodeMoveHistory();
    },
    [updateNodePosition, recordNodeMoveHistory]
  );

  // Handle node drag
  const onNodeDrag = useCallback(
    (event, node) => {
      updateNodePosition(node.id, node.position);
    },
    [updateNodePosition]
  );

  // Handle connect (drag handle to handle)
  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) return;
      openModal('addRelationship', {
        source: params.source,
        target: params.target
      });
    },
    [openModal]
  );

  // Selection handlers
  const onNodeClick = useCallback(
    (event, node) => {
      selectElement({ type: 'class', id: node.id });
    },
    [selectElement]
  );

  const onEdgeClick = useCallback(
    (event, edge) => {
      selectElement({ type: 'relationship', id: edge.id });
    },
    [selectElement]
  );

  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <div className="uml-canvas-container" ref={canvasRef}>
      {/* SVG Marker Definitions for UML Relationships */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          {/* UML Inheritance: Hollow triangle pointing to parent */}
          <marker
            id="uml-inheritance-arrow"
            viewBox="0 0 20 20"
            refX="18"
            refY="10"
            markerWidth="13"
            markerHeight="13"
            orient="auto"
          >
            <polygon
              points="2,2 18,10 2,18"
              fill={theme === 'dark' ? '#1e293b' : '#ffffff'}
              stroke={theme === 'dark' ? '#94a3b8' : '#334155'}
              strokeWidth="2"
            />
          </marker>

          {/* UML Dependency: Open arrow */}
          <marker
            id="uml-dependency-arrow"
            viewBox="0 0 20 20"
            refX="16"
            refY="10"
            markerWidth="12"
            markerHeight="12"
            orient="auto"
          >
            <polyline
              points="4,4 16,10 4,16"
              fill="none"
              stroke={theme === 'dark' ? '#94a3b8' : '#334155'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>
      </svg>

      {/* React Flow Diagram Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.5}
        deleteKeyCode={null} // We handle keyboard delete globally
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color={theme === 'dark' ? '#334155' : '#cbd5e1'}
        />
        <Controls className="uml-controls" />
        <MiniMap
          className="uml-minimap"
          nodeColor={() => (theme === 'dark' ? '#3b82f6' : '#2563eb')}
          maskColor={theme === 'dark' ? 'rgba(15, 23, 42, 0.75)' : 'rgba(241, 245, 249, 0.75)'}
          pannable
          zoomable
        />
      </ReactFlow>

      {/* Empty State overlay */}
      {classes.length === 0 && (
        <div className="uml-canvas-empty-state">
          <div className="empty-state-card">
            <div className="empty-state-icon">
              <Sparkles size={36} className="text-primary" />
            </div>
            <h3 className="empty-state-title">Your UML Diagram is Empty</h3>
            <p className="empty-state-subtitle">
              Start modeling your software architecture by creating your first UML class, or load an example from the toolbar.
            </p>
            <div className="empty-state-actions">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => openModal('addClass')}
              >
                Create Class
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UMLCanvas;
