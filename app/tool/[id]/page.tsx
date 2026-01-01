import { notFound } from "next/navigation";
import { getToolById } from "@/lib/tool-registry";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
