import { memo } from "react";
import { Handle, Position } from "reactflow";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface NotificationNodeProps {
  data: {
    name: string;
    recipients?: string;
    channel?: "email" | "sms" | "push" | "slack";
  };
  selected: boolean;
}

function NotificationNode({ data, selected }: NotificationNodeProps) {
  const channelColors = {
    email: "bg-blue-500",
    sms: "bg-green-500",
    push: "bg-purple-500",
    slack: "bg-yellow-500",
  };

  const channelIcons = {
    email: <Mail className="h-3.5 w-3.5" />,
    sms: <Smartphone className="h-3.5 w-3.5" />,
    push: <Bell className="h-3.5 w-3.5" />,
    slack: <MessageSquare className="h-3.5 w-3.5" />,
  };

  return (
    <div
      className={cn(
        "px-4 py-3 shadow-md rounded-md bg-white border-2 w-[250px] transition-all",
        selected ? "border-primary ring-2 ring-primary/20" : "border-amber-200"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-md bg-amber-50">
          <Bell className="h-4 w-4 text-amber-500" />
        </div>
        <div className="font-medium text-sm">{data.name}</div>
      </div>

      {data.recipients && (
        <div className="mt-3 text-xs text-slate-600">
          <div className="font-medium mb-1">Recipients:</div>
          <div className="bg-slate-50 p-2 rounded border border-slate-100">
            {data.recipients}
          </div>
        </div>
      )}

      {data.channel && (
        <div className="mt-3 flex items-center gap-2">
          <Badge
            className={cn(
              "text-white text-xs flex items-center gap-1",
              channelColors[data.channel] || "bg-gray-500"
            )}
          >
            {channelIcons[data.channel]}
            {data.channel.charAt(0).toUpperCase() + data.channel.slice(1)}
          </Badge>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-amber-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-amber-500 border-2 border-white"
      />
    </div>
  );
}

export default memo(NotificationNode);
