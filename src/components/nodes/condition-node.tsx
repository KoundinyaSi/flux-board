import { memo } from "react";
import { Handle, Position } from "reactflow";
import { GitBranch } from "lucide-react";
import { cn } from "~/lib/utils";

function ConditionNode({
  data,
  selected,
}: {
  data: { name: string; condition: string };
  selected: boolean;
}) {
  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-md bg-white border-2 w-[250px] transition-all",
        selected ? "border-primary ring-2 ring-primary/20" : "border-blue-200"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-blue-50">
          <GitBranch className="h-4 w-4 text-blue-500" />
        </div>
        <div className="font-medium text-sm">{data.name}</div>
      </div>

      {data.condition && (
        <div className="mt-3 text-xs bg-slate-50 p-2 rounded border border-slate-100">
          <code>{data.condition}</code>
        </div>
      )}

      <div className="mt-3 flex justify-between text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>True</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span>False</span>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white -right-3"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white -left-3"
      />
    </div>
  );
}

export default memo(ConditionNode);
