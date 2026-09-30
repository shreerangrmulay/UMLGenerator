import dagre from 'dagre';

/**
 * Calculates auto-layout positions for UML classes using Dagre directed graph layout.
 */
export function getAutoLayoutedElements(classes, relationships, direction = 'TB') {
  if (!classes || classes.length === 0) return { classes };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 60,
    ranksep: 80,
    marginx: 50,
    marginy: 50
  });

  classes.forEach((cls) => {
    const attrCount = cls.attributes?.length || 0;
    const methodCount = cls.methods?.length || 0;
    const nodeWidth = 260;
    const nodeHeight = Math.max(140, 70 + attrCount * 26 + methodCount * 26);

    dagreGraph.setNode(cls.id, { width: nodeWidth, height: nodeHeight });
  });

  relationships.forEach((rel) => {
    // Only add edge if both source and target exist
    if (
      classes.some((c) => c.id === rel.source) &&
      classes.some((c) => c.id === rel.target)
    ) {
      dagreGraph.setEdge(rel.source, rel.target);
    }
  });

  dagre.layout(dagreGraph);

  const updatedClasses = classes.map((cls) => {
    const nodeWithPosition = dagreGraph.node(cls.id);
    return {
      ...cls,
      position: {
        x: Math.round(nodeWithPosition.x - nodeWithPosition.width / 2),
        y: Math.round(nodeWithPosition.y - nodeWithPosition.height / 2)
      }
    };
  });

  return { classes: updatedClasses };
}
