import { notFound } from "next/navigation";
import { getToolById, isToolAccessible } from "@/lib/tool-registry";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const runtime = 'edge';

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tool = getToolById(id);

  if (!tool) {
    notFound();
  }

  // Check if tool is accessible in current mode
  if (!isToolAccessible(tool)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/tools">
              <Button variant="ghost" size="sm">
                ← Back to Tools
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <span>🔒</span> Access Restricted
            </CardTitle>
            <CardDescription>
              {tool.name} is marked as an internal-only tool
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This tool is only available when the site is deployed in internal mode. 
              Internal-only tools may have security implications when exposed publicly, 
              such as the ability to make arbitrary network requests or probe infrastructure.
            </p>
            <p className="text-sm text-muted-foreground">
              If you need access to this tool, please use an internal deployment or 
              contact your administrator.
            </p>
            <Link href="/tools">
              <Button>
                Browse Available Tools
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ToolComponent = tool.component;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/tools">
            <Button variant="ghost" size="sm">
              ← Back to Tools
            </Button>
          </Link>
        </div>
      </div>

      <ToolComponent />
    </div>
  );
}
