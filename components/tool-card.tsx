import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/lib/types/tool";
import { Badge } from "@/components/ui/badge";
import { isToolAccessible } from "@/lib/tool-registry";

const categoryIcons: Record<string, string> = {
  Network: "🌐",
  "Data Processing": "📊",
  Encoding: "🔤",
  Security: "🔒",
  Image: "🖼️",
  Development: "💻",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const accessible = isToolAccessible(tool);

  if (!accessible) {
    // Disabled card for internal-only tools in public mode
    return (
      <div className="group cursor-not-allowed">
        <Card className="h-full opacity-50 bg-muted">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-2xl grayscale">{categoryIcons[tool.category] || "🔧"}</div>
              <div className="flex gap-1">
                <Badge variant="destructive" className="text-xs">
                  Internal Only
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold text-muted-foreground">
                {tool.name}
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {tool.description}
              </CardDescription>
              <p className="text-xs text-destructive mt-2">
                🔒 This tool is only available on internal deployments
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/tool/${tool.id}`} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/50 group-hover:scale-[1.02] cursor-pointer">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="text-2xl">{categoryIcons[tool.category] || "🔧"}</div>
            <div className="flex gap-1">
              {tool.internalOnly && (
                <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                  Internal
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {tool.category}
              </Badge>
            </div>
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
