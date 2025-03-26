"use client";

import { useState, useCallback, useRef } from "react";
import { ReactFlowProvider } from "reactflow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import WorkflowCanvas from "~/components/workflow-canvas";
import NodeConfigPanel from "~/components/node-config-panel";
import WorkflowTable from "~/components/workflow-table";
import { Button } from "~/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useWorkflowState } from "~/lib/hooks/use-workflow-state";
import { exportWorkflow, importWorkflow } from "~/lib/utils/workflow-utils";
import { toast } from "sonner";

export default function WorkflowBuilder() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    deleteEdge,
    setNodes,
    setEdges,
  } = useWorkflowState();

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface Node {
    id: string;
    data: any;
    position: { x: number; y: number };
    type: string;
  }

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  interface NodeData {
    [key: string]: any;
  }

  interface NodeUpdateData {
    nodeId: string;
    data: NodeData;
  }

  const handleNodeUpdate = useCallback(
    (nodeId: string, data: NodeData) => {
      updateNode(nodeId, data);
      // Get the current nodes and edges after the update
    },
    [updateNode, edges]
  );

  const handleExport = useCallback(() => {
    const data = exportWorkflow(nodes, edges);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workflow.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Your workflow has been exported as JSON");
  }, [nodes, edges]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const { nodes: importedNodes, edges: importedEdges } = importWorkflow(
            JSON.parse(content)
          );
          setNodes(importedNodes);
          setEdges(importedEdges);
          toast.info("Your workflow has been imported successfully");
        } catch (error) {
          toast.error("Failed to import workflow. Invalid format.");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [setNodes, setEdges]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      <div
        id="workflow-controls"
        className="border-b p-4 flex justify-between items-center bg-background"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1 h-9 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="flex items-center gap-1 h-9 text-xs"
          >
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>

      <Tabs
        defaultValue="canvas"
        className="flex-1 flex flex-col"
        id="workflow-tabs"
      >
        <div className="border-b bg-slate-50 dark:bg-slate-900/20">
          <div className="container">
            <TabsList className="mx-0 mt-0 bg-transparent h-12">
              <TabsTrigger
                value="canvas"
                className="data-[state=active]:bg-background rounded-t-lg rounded-b-none border-t border-l border-r data-[state=active]:border-border data-[state=active]:border-b-0 border-transparent data-[state=active]:shadow-none"
              >
                Canvas
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="data-[state=active]:bg-background rounded-t-lg rounded-b-none border-t border-l border-r data-[state=active]:border-border data-[state=active]:border-b-0 border-transparent data-[state=active]:shadow-none"
              >
                Table
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="canvas" className="flex-1 flex m-0 border-none p-0">
          <ReactFlowProvider>
            <div className="flex-1 relative" id="workflow-canvas">
              <WorkflowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                addNode={addNode}
                deleteNode={deleteNode}
                deleteEdge={deleteEdge}
              />
            </div>
          </ReactFlowProvider>
          {selectedNode && (
            <div id="node-config-panel">
              <NodeConfigPanel
                node={selectedNode}
                onUpdate={handleNodeUpdate}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          )}
        </TabsContent>
        <TabsContent
          value="table"
          className="flex-1 p-6 overflow-auto m-0 border-none"
        >
          <WorkflowTable
            nodes={nodes as Node[]}
            onNodeUpdate={handleNodeUpdate}
            onNodeSelect={setSelectedNode}
            onNodeDelete={(nodeId) => {
              deleteNode(nodeId);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
