"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function DiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const getDiff = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const result = [];
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";
      
      if (line1 === line2) {
        result.push({ type: "equal", line1, line2, num: i + 1 });
      } else if (!line1) {
        result.push({ type: "added", line1: "", line2, num: i + 1 });
      } else if (!line2) {
        result.push({ type: "removed", line1, line2: "", num: i + 1 });
      } else {
        result.push({ type: "modified", line1, line2, num: i + 1 });
      }
    }
    return result;
  };

  const diff = getDiff();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Diff Comparison Tool</CardTitle>
          <CardDescription>Compare text differences side by side</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text1">Original Text</Label>
              <Textarea
                id="text1"
                placeholder="Enter original text..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text2">Modified Text</Label>
              <Textarea
                id="text2"
                placeholder="Enter modified text..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </div>

          {(text1 || text2) && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-2 font-semibold text-sm">
                Differences
              </div>
              <div className="divide-y max-h-96 overflow-auto">
                {diff.map((item, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-2 gap-4 p-2 font-mono text-sm ${
                      item.type === "equal"
                        ? "bg-background"
                        : item.type === "added"
                        ? "bg-green-50 dark:bg-green-950"
                        : item.type === "removed"
                        ? "bg-red-50 dark:bg-red-950"
                        : "bg-yellow-50 dark:bg-yellow-950"
                    }`}
                  >
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-8">{item.num}</span>
                      <span className={item.type === "removed" || item.type === "modified" ? "text-red-600 dark:text-red-400" : ""}>
                        {item.line1}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-muted-foreground w-8">{item.num}</span>
                      <span className={item.type === "added" || item.type === "modified" ? "text-green-600 dark:text-green-400" : ""}>
                        {item.line2}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
