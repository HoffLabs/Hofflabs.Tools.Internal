"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiffLine {
  type: "equal" | "added" | "removed" | "modified";
  line1: string;
  line2: string;
  num1: number | null;
  num2: number | null;
}

// Compute character-level diff for a modified line
function getCharDiff(str1: string, str2: string): { added: number[]; removed: number[] } {
  const added: number[] = [];
  const removed: number[] = [];
  
  // Simple LCS-based character diff
  const m = str1.length;
  const n = str2.length;
  
  // Build LCS table
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find differences
  let i = m, j = n;
  const matched1 = new Set<number>();
  const matched2 = new Set<number>();
  
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      matched1.add(i - 1);
      matched2.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  for (let k = 0; k < m; k++) {
    if (!matched1.has(k)) removed.push(k);
  }
  for (let k = 0; k < n; k++) {
    if (!matched2.has(k)) added.push(k);
  }
  
  return { added, removed };
}

export default function DiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const diff = useMemo(() => {
    const processLine = (line: string) => {
      if (ignoreWhitespace) {
        return line.trim().replace(/\s+/g, " ");
      }
      return line;
    };

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    
    // Simple line-by-line diff with basic alignment
    const result: DiffLine[] = [];
    let i = 0, j = 0;
    let num1 = 1, num2 = 1;
    
    while (i < lines1.length || j < lines2.length) {
      const line1 = lines1[i] ?? "";
      const line2 = lines2[j] ?? "";
      const processed1 = processLine(line1);
      const processed2 = processLine(line2);
      
      if (i >= lines1.length) {
        result.push({ type: "added", line1: "", line2, num1: null, num2: num2++ });
        j++;
      } else if (j >= lines2.length) {
        result.push({ type: "removed", line1, line2: "", num1: num1++, num2: null });
        i++;
      } else if (processed1 === processed2) {
        result.push({ type: "equal", line1, line2, num1: num1++, num2: num2++ });
        i++;
        j++;
      } else {
        // Check if line was added or removed by looking ahead
        const line1InFuture = lines2.slice(j + 1, j + 4).findIndex(l => processLine(l) === processed1);
        const line2InFuture = lines1.slice(i + 1, i + 4).findIndex(l => processLine(l) === processed2);
        
        if (line1InFuture !== -1 && (line2InFuture === -1 || line1InFuture <= line2InFuture)) {
          // Current line2 was added
          result.push({ type: "added", line1: "", line2, num1: null, num2: num2++ });
          j++;
        } else if (line2InFuture !== -1) {
          // Current line1 was removed
          result.push({ type: "removed", line1, line2: "", num1: num1++, num2: null });
          i++;
        } else {
          // Line was modified
          result.push({ type: "modified", line1, line2, num1: num1++, num2: num2++ });
          i++;
          j++;
        }
      }
    }
    
    return result;
  }, [text1, text2, ignoreWhitespace]);

  const stats = useMemo(() => {
    return {
      additions: diff.filter(d => d.type === "added").length,
      deletions: diff.filter(d => d.type === "removed").length,
      modifications: diff.filter(d => d.type === "modified").length,
      unchanged: diff.filter(d => d.type === "equal").length,
    };
  }, [diff]);

  const renderCharDiff = (line: string, highlights: number[], type: "added" | "removed") => {
    if (highlights.length === 0) return <span>{line}</span>;
    
    const result: React.ReactElement[] = [];
    let lastIdx = 0;
    const highlightSet = new Set(highlights);
    
    for (let i = 0; i <= line.length; i++) {
      if (i === line.length || highlightSet.has(i) !== highlightSet.has(lastIdx)) {
        if (i > lastIdx) {
          const chunk = line.slice(lastIdx, i);
          if (highlightSet.has(lastIdx)) {
            result.push(
              <span 
                key={lastIdx} 
                className={type === "added" 
                  ? "bg-green-300 dark:bg-green-700 rounded px-0.5" 
                  : "bg-red-300 dark:bg-red-700 rounded px-0.5"
                }
              >
                {chunk}
              </span>
            );
          } else {
            result.push(<span key={lastIdx}>{chunk}</span>);
          }
        }
        lastIdx = i;
      }
    }
    
    return <>{result}</>;
  };

  const swapTexts = () => {
    setText1(text2);
    setText2(text1);
  };

  const clearAll = () => {
    setText1("");
    setText2("");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Code Diff Tool</CardTitle>
              <CardDescription>Compare code and text with character-level highlighting</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={swapTexts}>
                Swap
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text1" className="flex items-center gap-2">
                Original
                <Badge variant="secondary" className="text-xs">{text1.split("\n").length} lines</Badge>
              </Label>
              <Textarea
                id="text1"
                placeholder="Paste original code or text..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                rows={14}
                className="font-mono text-sm resize-none"
                spellCheck={false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text2" className="flex items-center gap-2">
                Modified
                <Badge variant="secondary" className="text-xs">{text2.split("\n").length} lines</Badge>
              </Label>
              <Textarea
                id="text2"
                placeholder="Paste modified code or text..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                rows={14}
                className="font-mono text-sm resize-none"
                spellCheck={false}
              />
            </div>
          </div>

          {(text1 || text2) && (
            <>
              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Changes:</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                    +{stats.additions} added
                  </Badge>
                  <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                    -{stats.deletions} removed
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    ~{stats.modifications} modified
                  </Badge>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ignoreWhitespace}
                      onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                      className="rounded"
                    />
                    Ignore whitespace
                  </label>
                </div>
              </div>

              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "split" | "unified")}>
                <TabsList>
                  <TabsTrigger value="split">Split View</TabsTrigger>
                  <TabsTrigger value="unified">Unified View</TabsTrigger>
                </TabsList>

                <TabsContent value="split">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-[500px] overflow-auto">
                      <table className="w-full text-sm font-mono">
                        <tbody>
                          {diff.map((item, idx) => {
                            const charDiff = item.type === "modified" 
                              ? getCharDiff(item.line1, item.line2) 
                              : { added: [], removed: [] };
                            
                            return (
                              <tr key={idx} className={`
                                ${item.type === "equal" ? "" : ""}
                                ${item.type === "added" ? "bg-green-500/10" : ""}
                                ${item.type === "removed" ? "bg-red-500/10" : ""}
                                ${item.type === "modified" ? "bg-yellow-500/10" : ""}
                              `}>
                                <td className="w-12 text-right pr-2 text-muted-foreground select-none border-r bg-muted/30">
                                  {item.num1 ?? ""}
                                </td>
                                <td className={`px-2 py-0.5 whitespace-pre-wrap break-all w-1/2 border-r ${
                                  item.type === "removed" || item.type === "modified" 
                                    ? "text-red-600 dark:text-red-400" 
                                    : ""
                                }`}>
                                  {item.type === "modified" 
                                    ? renderCharDiff(item.line1, charDiff.removed, "removed")
                                    : item.line1 || (item.type === "added" ? "" : "\u00A0")
                                  }
                                </td>
                                <td className="w-12 text-right pr-2 text-muted-foreground select-none border-r bg-muted/30">
                                  {item.num2 ?? ""}
                                </td>
                                <td className={`px-2 py-0.5 whitespace-pre-wrap break-all w-1/2 ${
                                  item.type === "added" || item.type === "modified" 
                                    ? "text-green-600 dark:text-green-400" 
                                    : ""
                                }`}>
                                  {item.type === "modified" 
                                    ? renderCharDiff(item.line2, charDiff.added, "added")
                                    : item.line2 || (item.type === "removed" ? "" : "\u00A0")
                                  }
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="unified">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-[500px] overflow-auto">
                      <table className="w-full text-sm font-mono">
                        <tbody>
                          {diff.map((item, idx) => {
                            if (item.type === "equal") {
                              return (
                                <tr key={idx}>
                                  <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r">
                                    {item.num1}
                                  </td>
                                  <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r">
                                    {item.num2}
                                  </td>
                                  <td className="w-6 text-center text-muted-foreground select-none">
                                    
                                  </td>
                                  <td className="px-2 py-0.5 whitespace-pre-wrap break-all">
                                    {item.line1 || "\u00A0"}
                                  </td>
                                </tr>
                              );
                            }
                            
                            if (item.type === "modified") {
                              return (
                                <>
                                  <tr key={`${idx}-del`} className="bg-red-500/10">
                                    <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r">
                                      {item.num1}
                                    </td>
                                    <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r"></td>
                                    <td className="w-6 text-center text-red-600 select-none font-bold">-</td>
                                    <td className="px-2 py-0.5 whitespace-pre-wrap break-all text-red-600 dark:text-red-400">
                                      {item.line1}
                                    </td>
                                  </tr>
                                  <tr key={`${idx}-add`} className="bg-green-500/10">
                                    <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r"></td>
                                    <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r">
                                      {item.num2}
                                    </td>
                                    <td className="w-6 text-center text-green-600 select-none font-bold">+</td>
                                    <td className="px-2 py-0.5 whitespace-pre-wrap break-all text-green-600 dark:text-green-400">
                                      {item.line2}
                                    </td>
                                  </tr>
                                </>
                              );
                            }
                            
                            return (
                              <tr key={idx} className={item.type === "added" ? "bg-green-500/10" : "bg-red-500/10"}>
                                <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r">
                                  {item.num1 ?? ""}
                                </td>
                                <td className="w-10 text-right pr-1 text-muted-foreground select-none bg-muted/30 border-r">
                                  {item.num2 ?? ""}
                                </td>
                                <td className={`w-6 text-center select-none font-bold ${
                                  item.type === "added" ? "text-green-600" : "text-red-600"
                                }`}>
                                  {item.type === "added" ? "+" : "-"}
                                </td>
                                <td className={`px-2 py-0.5 whitespace-pre-wrap break-all ${
                                  item.type === "added" 
                                    ? "text-green-600 dark:text-green-400" 
                                    : "text-red-600 dark:text-red-400"
                                }`}>
                                  {item.type === "added" ? item.line2 : item.line1}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
