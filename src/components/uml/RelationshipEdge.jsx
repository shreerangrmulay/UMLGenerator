import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath
} from '@xyflow/react';
import { useUMLStore } from '../../store/umlStore';
import { X } from 'lucide-react';

/**
 * Custom React Flow Edge for UML Relationships:
 * - Association (solid line, multiplicities, center label)
 * - Inheritance (solid line, hollow triangle marker pointing to parent)
 * - Dependency (dashed line, open arrowhead marker pointing to dependency)
 */
export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {},
  selected
}) {
  const selectElement = useUMLStore((state) => state.selectElement);
  const deleteRelationship = useUMLStore((state) => state.deleteRelationship);
  const relType = data.type || 'association';

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8
  });

  // Calculate approximate positions for source and target multiplicity labels
  const sourceMultX = sourceX + (labelX - sourceX) * 0.35;
  const sourceMultY = sourceY + (labelY - sourceY) * 0.35;

  const targetMultX = targetX + (labelX - targetX) * 0.35;
  const targetMultY = targetY + (labelY - targetY) * 0.35;

  // Determine marker & style by type
  let markerEnd = '';
  let strokeDasharray = undefined;

  if (relType === 'inheritance') {
    markerEnd = 'url(#uml-inheritance-arrow)';
  } else if (relType === 'dependency') {
    markerEnd = 'url(#uml-dependency-arrow)';
    strokeDasharray = '5 5';
  }

  const handleEdgeClick = (e) => {
    e.stopPropagation();
    selectElement({ type: 'relationship', id });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteRelationship(id);
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: selected ? 2.5 : 1.75,
          stroke: selected ? 'var(--primary)' : 'var(--edge-color)',
          strokeDasharray,
          cursor: 'pointer'
        }}
        interactionWidth={20}
      />

      <EdgeLabelRenderer>
        {/* Source Multiplicity */}
        {data.sourceMultiplicity && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${sourceMultX}px,${sourceMultY}px)`,
              pointerEvents: 'none'
            }}
            className="uml-multiplicity-badge"
          >
            {data.sourceMultiplicity}
          </div>
        )}

        {/* Target Multiplicity */}
        {data.targetMultiplicity && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${targetMultX}px,${targetMultY}px)`,
              pointerEvents: 'none'
            }}
            className="uml-multiplicity-badge"
          >
            {data.targetMultiplicity}
          </div>
        )}

        {/* Center Label & Quick Controls */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all'
          }}
          className={`uml-edge-center-badge ${selected ? 'selected' : ''}`}
          onClick={handleEdgeClick}
        >
          {data.label && <span className="uml-edge-text">{data.label}</span>}
          {selected && (
            <button
              className="uml-edge-delete-btn"
              onClick={handleDeleteClick}
              title="Delete Relationship"
              aria-label="Delete relationship"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default RelationshipEdge;
