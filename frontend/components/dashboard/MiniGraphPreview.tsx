"use client";

import {
  Background,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
  Position,
} from "@xyflow/react";

const nodeStyle = {
  width: 132,
  border: "1px solid hsl(178 85% 52% / 0.32)",
  background: "hsl(220 34% 8% / 0.82)",
  color: "hsl(210 40% 96%)",
  boxShadow: "0 0 28px hsl(188 100% 58% / 0.14)",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
};

const nodes: Node[] = [
  {
    id: "frontend",
    data: { label: "Frontend" },
    position: { x: 0, y: 86 },
    sourcePosition: Position.Right,
    style: nodeStyle,
  },
  {
    id: "api",
    data: { label: "API Routes" },
    position: { x: 180, y: 86 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: nodeStyle,
  },
  {
    id: "auth",
    data: { label: "Auth Service" },
    position: { x: 360, y: 32 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: nodeStyle,
  },
  {
    id: "database",
    data: { label: "Database" },
    position: { x: 360, y: 142 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: nodeStyle,
  },
  {
    id: "agent",
    data: { label: "AI Agent" },
    position: { x: 540, y: 86 },
    targetPosition: Position.Left,
    style: {
      ...nodeStyle,
      border: "1px solid hsl(258 92% 68% / 0.42)",
      boxShadow: "0 0 34px hsl(258 92% 68% / 0.18)",
    },
  },
];

const edges: Edge[] = [
  {
    id: "frontend-api",
    source: "frontend",
    target: "api",
    animated: true,
  },
  {
    id: "api-auth",
    source: "api",
    target: "auth",
    animated: true,
  },
  {
    id: "api-database",
    source: "api",
    target: "database",
    animated: true,
  },
  {
    id: "auth-agent",
    source: "auth",
    target: "agent",
    animated: true,
  },
  {
    id: "database-agent",
    source: "database",
    target: "agent",
    animated: true,
  },
];

export function MiniGraphPreview() {
  return (
    <div className="h-[23rem] overflow-hidden rounded-card border border-white/10 bg-black/24">
      <ReactFlow
        colorMode="dark"
        edges={edges}
        nodes={nodes}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(188 100% 58%)" },
          style: {
            stroke: "hsl(188 100% 58% / 0.72)",
            strokeWidth: 1.5,
          },
        }}
        edgesFocusable={false}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        nodesConnectable={false}
        nodesDraggable={false}
        nodesFocusable={false}
        panOnDrag={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
        zoomOnDoubleClick={false}
        zoomOnPinch={false}
        zoomOnScroll={false}
      >
        <Background color="hsl(188 100% 58% / 0.18)" gap={22} size={1} />
      </ReactFlow>
    </div>
  );
}
