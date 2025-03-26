"use client";

import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { NodeTypeSelect } from "~/components/node-type-select";
import TaskNode from "~/components/nodes/task-node";
import ConditionNode from "~/components/nodes/condition-node";
import NotificationNode from "~/components/nodes/notification-node";
import documentNode from "./nodes/document-node";
import EmailNode from "./nodes/email-node";
import { toast } from "sonner";
import databaseNode from "./nodes/database-node";

// Register custom node types
const nodeTypes = {
  task: TaskNode,
  condition: ConditionNode,
  notification: NotificationNode,
  document: documentNode,
  email: EmailNode,
  database: databaseNode,
};

interface WorkflowCanvasProps {
  nodes: any[];
  edges: any[];
  onNodesChange: (nodes: any[]) => void;
  onEdgesChange: (edges: any[]) => void;
  onConnect: (edge: any) => void;
  onNodeClick: (event: React.MouseEvent, node: any) => void;
  onPaneClick: () => void;
  addNode: (node: any) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
}

export default function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  addNode,
  deleteNode,
  deleteEdge,
}: WorkflowCanvasProps) {
  const reactFlowInstance = useReactFlow();
  const [isAddingNode, setIsAddingNode] = useState(false);
  const reactFlowWrapper = useRef(null);

  const handleAddNode = useCallback(
    (type: any) => {
      const position = reactFlowInstance.project({
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      addNode(newNode);
      setIsAddingNode(false);
      toast.success(`Added a new ${type} node to the workflow`);
    },
    [reactFlowInstance, addNode, nodes, edges]
  );

  const handleDeleteElements = useCallback(
    (event: any) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        const selectedNodes = nodes.filter((node) => node.selected);
        const selectedEdges = edges.filter((edge) => edge.selected);

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          selectedNodes.forEach((node) => deleteNode(node.id));
          selectedEdges.forEach((edge) => deleteEdge(edge.id));
          toast.success(
            `Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges`
          );
        }
      }
    },
    [nodes, edges, deleteNode, deleteEdge]
  );

  // Add event listener for delete key
  const onInit = useCallback(() => {
    window.addEventListener("keydown", handleDeleteElements);
    return () => {
      window.removeEventListener("keydown", handleDeleteElements);
    };
  }, [handleDeleteElements]);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(params) => {
          const newEdge = { ...params, id: `edge-${Date.now()}` };
          onConnect(newEdge);
          // Use setTimeout to break the update cycle
        }}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        onInit={onInit}
        deleteKeyCode={null} // Disable default delete to use our custom handler
        className="bg-slate-50 dark:bg-slate-900/20"
      >
        <Background gap={12} size={1} color="white" />
        <Controls className="bg-white border rounded-md shadow-sm" />
        <MiniMap
          id="workflow-minimap"
          className="bg-background border rounded-md shadow-sm"
          nodeStrokeColor={(n) => {
            if (n.type === "task") return "#ff0072";
            if (n.type === "condition") return "#0041d0";
            if (n.type === "notification") return "#1a192b";
            return "#eee";
          }}
          nodeColor={(n) => {
            if (n.type === "task") return "#ff0072";
            if (n.type === "condition") return "#0041d0";
            if (n.type === "notification") return "#1a192b";
            return "#fff";
          }}
        />
        <Panel position="top-left">
          {isAddingNode ? (
            <div id="node-types">
              <NodeTypeSelect
                onSelect={handleAddNode}
                onCancel={() => setIsAddingNode(false)}
              />
            </div>
          ) : (
            <Button
              id="add-node-button"
              onClick={() => setIsAddingNode(true)}
              className="flex items-center gap-2 shadow-md bg-black hover:bg-black/90 text-white"
            >
              <Plus className="h-4 w-4" /> Add Node
            </Button>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
}

function getDefaultNodeData(type: any) {
  switch (type) {
    case "task":
      return {
        name: "New Task",
        assignee: "",
        dueDate: "",
        description: "",
        status: "pending",
      };
    case "condition":
      return {
        name: "New Condition",
        condition: "",
        description: "",
      };
    case "notification":
      return {
        name: "New Notification",
        recipients: "",
        message: "",
        channel: "email",
      };
    case "document":
      return {
        name: "New Document",
        content: "",
        author: "",
        lastModified: new Date().toISOString(),
      };
    case "database":
      return {
        name: "New Database",
        host: "",
        port: 5432,
        username: "",
        password: "",
      };
    case "email":
      return {
        name: "New Email",
        to: "",
        subject: "",
        body: "",
        sent: false,
      };
    default:
      return { name: "New Node" };
  }
}
