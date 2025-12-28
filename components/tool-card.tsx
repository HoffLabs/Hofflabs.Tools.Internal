import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/lib/types/tool";
import { Badge } from "@/components/ui/badge";

const categoryIcons: Record<string, string> = {
  Network: "🌐",
  "Data Processing": "📊",
  Encoding: "🔤",
  Security: "🔒",
  Image: "🖼️",
  Development: "💻",
};

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tool/${tool.id}`} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 group-hover:scale-[1.02] cursor-pointer">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="text-2xl">{categoryIcons[tool.category] || "🔧"}</div>
            <Badge variant="secondary" className="text-xs">
              {tool.category}
            </Badge>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
              {tool.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {tool.description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
