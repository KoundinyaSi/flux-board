import { memo } from "react";
import { Handle, Position } from "reactflow";
import { FileText } from "lucide-react";
import { cn } from "~/lib/utils";

function DocumentNode({
  data,
  selected,
}: {
  data: { name: string; content: string };
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-md bg-white border-2 w-[250px] transition-all",
        selected ? "border-primary ring-2 ring-primary/20" : "border-purple-200"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-purple-50">
          <FileText className="h-4 w-4 text-purple-500" />
        </div>
        <div className="font-medium text-sm">{data.name}</div>
      </div>

      {data.content && (
        <div className="mt-3 text-xs bg-slate-50 p-2 rounded border border-slate-100">
          <code>{data.content}</code>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
}

export default memo(DocumentNode);
