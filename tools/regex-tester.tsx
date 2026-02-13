"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Match highlight colors (cycling)
const MATCH_COLORS = [
  { bg: "bg-yellow-200 dark:bg-yellow-800", text: "text-yellow-900 dark:text-yellow-100" },
  { bg: "bg-green-200 dark:bg-green-800", text: "text-green-900 dark:text-green-100" },
  { bg: "bg-blue-200 dark:bg-blue-800", text: "text-blue-900 dark:text-blue-100" },
  { bg: "bg-pink-200 dark:bg-pink-800", text: "text-pink-900 dark:text-pink-100" },
  { bg: "bg-purple-200 dark:bg-purple-800", text: "text-purple-900 dark:text-purple-100" },
  { bg: "bg-orange-200 dark:bg-orange-800", text: "text-orange-900 dark:text-orange-100" },
];

// Common regex patterns for the builder
const COMMON_PATTERNS = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", desc: "Match email addresses" },
  { name: "URL", pattern: "https?:\\/\\/[^\\s]+", desc: "Match HTTP/HTTPS URLs" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}", desc: "Match US phone numbers" },
  { name: "IPv4", pattern: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b", desc: "Match IPv4 addresses" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}", desc: "Match ISO date format" },
  { name: "Time (HH:MM)", pattern: "\\d{1,2}:\\d{2}(:\\d{2})?", desc: "Match time format" },
  { name: "Hex Color", pattern: "#[0-9A-Fa-f]{3,6}\\b", desc: "Match hex color codes" },
  { name: "HTML Tag", pattern: "<[^>]+>", desc: "Match HTML tags" },
  { name: "Number", pattern: "-?\\d+(\\.\\d+)?", desc: "Match integers and decimals" },
  { name: "Word", pattern: "\\b\\w+\\b", desc: "Match whole words" },
  { name: "Whitespace", pattern: "\\s+", desc: "Match whitespace" },
  { name: "UUID", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}", desc: "Match UUIDs" },
];

// Pattern building blocks
const PATTERN_BLOCKS = {
  characters: [
    { label: "Any character", value: ".", desc: "Matches any single character" },
    { label: "Digit", value: "\\d", desc: "Matches any digit (0-9)" },
    { label: "Non-digit", value: "\\D", desc: "Matches any non-digit" },
    { label: "Word char", value: "\\w", desc: "Matches [a-zA-Z0-9_]" },
    { label: "Non-word char", value: "\\W", desc: "Matches non-word characters" },
    { label: "Whitespace", value: "\\s", desc: "Matches space, tab, newline" },
    { label: "Non-whitespace", value: "\\S", desc: "Matches non-whitespace" },
  ],
  quantifiers: [
    { label: "0 or more", value: "*", desc: "Match 0 or more times" },
    { label: "1 or more", value: "+", desc: "Match 1 or more times" },
    { label: "0 or 1", value: "?", desc: "Match 0 or 1 time" },
    { label: "Exactly n", value: "{n}", desc: "Match exactly n times" },
    { label: "n or more", value: "{n,}", desc: "Match n or more times" },
    { label: "Between n-m", value: "{n,m}", desc: "Match between n and m times" },
  ],
  anchors: [
    { label: "Start of string", value: "^", desc: "Match start of string" },
    { label: "End of string", value: "$", desc: "Match end of string" },
    { label: "Word boundary", value: "\\b", desc: "Match word boundary" },
    { label: "Non-boundary", value: "\\B", desc: "Match non-word boundary" },
  ],
  groups: [
    { label: "Capture group", value: "(...)", desc: "Capture for back-reference" },
    { label: "Non-capture", value: "(?:...)", desc: "Group without capturing" },
    { label: "OR", value: "|", desc: "Match either pattern" },
    { label: "Character set", value: "[...]", desc: "Match any char in set" },
    { label: "Negated set", value: "[^...]", desc: "Match any char NOT in set" },
  ],
};

interface MatchInfo {
  match: string;
  index: number;
  groups: string[];
  groupNames?: Record<string, string>;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
  const [testString, setTestString] = useState("");
  const [activeTab, setActiveTab] = useState("tester");

  const flagString = useMemo(() => {
    return Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("");
  }, [flags]);

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: "" };
    
    try {
      const regex = new RegExp(pattern, flagString || "g");
      const foundMatches: MatchInfo[] = [];
      let match;
      
      // Always use global mode for finding all matches for display
      const searchRegex = flagString.includes("g") ? regex : new RegExp(pattern, flagString + "g");
      
      while ((match = searchRegex.exec(testString)) !== null) {
        foundMatches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          groupNames: match.groups,
        });
        if (!flagString.includes("g")) break;
      }
      
      return { matches: foundMatches, error: "" };
    } catch (err) {
      return { matches: [], error: err instanceof Error ? err.message : "Invalid regex" };
    }
  }, [pattern, flagString, testString]);

  const highlightedText = useMemo(() => {
    if (!pattern || !testString || matches.length === 0) {
      return <span>{testString}</span>;
    }

    const result: React.ReactElement[] = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      // Add text before match
      if (m.index > lastIndex) {
        result.push(<span key={`text-${idx}`}>{testString.slice(lastIndex, m.index)}</span>);
      }
      
      // Add highlighted match
      const color = MATCH_COLORS[idx % MATCH_COLORS.length];
      result.push(
        <span
          key={`match-${idx}`}
          className={`${color.bg} ${color.text} rounded px-0.5`}
          title={`Match ${idx + 1}`}
        >
          {m.match}
        </span>
      );
      
      lastIndex = m.index + m.match.length;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      result.push(<span key="text-end">{testString.slice(lastIndex)}</span>);
    }

    return <>{result}</>;
  }, [pattern, testString, matches]);

  const insertPattern = useCallback((value: string) => {
    setPattern(prev => prev + value);
  }, []);

  const applyPreset = useCallback((preset: typeof COMMON_PATTERNS[0]) => {
    setPattern(preset.pattern);
  }, []);

  const toggleFlag = useCallback((flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Regex Tester & Builder</CardTitle>
          <CardDescription>Build and test regular expressions with visual highlighting</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="tester">Tester</TabsTrigger>
              <TabsTrigger value="builder">Pattern Builder</TabsTrigger>
              <TabsTrigger value="presets">Common Patterns</TabsTrigger>
              <TabsTrigger value="cheatsheet">Cheat Sheet</TabsTrigger>
            </TabsList>

            <TabsContent value="tester" className="space-y-4">
              {/* Pattern Input */}
              <div className="space-y-2">
                <Label htmlFor="pattern">Regular Expression</Label>
                <div className="flex gap-2">
                  <span className="flex items-center text-muted-foreground font-mono">/</span>
                  <Input
                    id="pattern"
                    placeholder="Enter your regex pattern..."
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="font-mono flex-1"
                    spellCheck={false}
                  />
                  <span className="flex items-center text-muted-foreground font-mono">/{flagString}</span>
                </div>
              </div>

              {/* Flags */}
              <div className="space-y-2">
                <Label>Flags</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "g" as const, label: "Global", desc: "Find all matches" },
                    { key: "i" as const, label: "Case Insensitive", desc: "Ignore case" },
                    { key: "m" as const, label: "Multiline", desc: "^ and $ match line boundaries" },
                    { key: "s" as const, label: "Dot All", desc: ". matches newlines" },
                    { key: "u" as const, label: "Unicode", desc: "Enable unicode support" },
                  ].map(f => (
                    <Button
                      key={f.key}
                      variant={flags[f.key] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFlag(f.key)}
                      title={f.desc}
                    >
                      {f.key}: {f.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Test String */}
              <div className="space-y-2">
                <Label htmlFor="testString">Test String</Label>
                <Textarea
                  id="testString"
                  placeholder="Enter text to test against your regex..."
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  rows={6}
                  className="font-mono"
                  spellCheck={false}
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-mono">
                  Error: {error}
                </div>
              )}

              {/* Results */}
              {pattern && testString && !error && (
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    <Badge variant={matches.length > 0 ? "default" : "secondary"}>
                      {matches.length} match{matches.length !== 1 ? "es" : ""}
                    </Badge>
                  </div>

                  {/* Highlighted Output */}
                  <div className="space-y-2">
                    <Label>Highlighted Matches</Label>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap break-all border">
                      {highlightedText}
                    </div>
                  </div>

                  {/* Match Details */}
                  {matches.length > 0 && (
                    <div className="space-y-2">
                      <Label>Match Details</Label>
                      <div className="grid gap-2 max-h-64 overflow-auto">
                        {matches.map((m, idx) => {
                          const color = MATCH_COLORS[idx % MATCH_COLORS.length];
                          return (
                            <div key={idx} className="bg-muted p-3 rounded-lg text-sm border">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`${color.bg} ${color.text} px-2 py-0.5 rounded text-xs font-medium`}>
                                  Match {idx + 1}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  Index: {m.index}
                                </span>
                              </div>
                              <div className="font-mono bg-background p-2 rounded border">
                                {m.match || <span className="text-muted-foreground italic">(empty string)</span>}
                              </div>
                              {m.groups.length > 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-muted-foreground">Capture Groups:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {m.groups.map((g, gIdx) => (
                                      <Badge key={gIdx} variant="outline" className="font-mono text-xs">
                                        ${gIdx + 1}: {g || "(empty)"}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="builder" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click on pattern elements below to build your regex. The pattern will be appended to your current expression.
              </p>
              
              <div className="space-y-2">
                <Label>Current Pattern</Label>
                <div className="flex gap-2">
                  <Input
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="font-mono flex-1"
                    placeholder="Your pattern builds here..."
                  />
                  <Button variant="outline" size="sm" onClick={() => setPattern("")}>
                    Clear
                  </Button>
                </div>
              </div>

              {Object.entries(PATTERN_BLOCKS).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <Label className="capitalize">{category}</Label>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => insertPattern(item.value)}
                        title={item.desc}
                        className="font-mono"
                      >
                        <span className="mr-2">{item.label}</span>
                        <Badge variant="secondary" className="text-xs">{item.value}</Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="presets" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click on a common pattern to use it. These are ready-to-use regular expressions for common use cases.
              </p>
              
              <div className="grid gap-2">
                {COMMON_PATTERNS.map((preset, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg border hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => applyPreset(preset)}
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">{preset.desc}</div>
                    </div>
                    <code className="text-xs bg-background px-2 py-1 rounded border max-w-[200px] truncate">
                      {preset.pattern}
                    </code>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cheatsheet" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Character Classes</Label>
                  <div className="bg-muted p-3 rounded-lg text-sm space-y-1 font-mono">
                    <div><span className="text-blue-600 dark:text-blue-400">.</span> - Any character except newline</div>
                    <div><span className="text-blue-600 dark:text-blue-400">\d</span> - Digit [0-9]</div>
                    <div><span className="text-blue-600 dark:text-blue-400">\D</span> - Non-digit</div>
                    <div><span className="text-blue-600 dark:text-blue-400">\w</span> - Word character [a-zA-Z0-9_]</div>
                    <div><span className="text-blue-600 dark:text-blue-400">\W</span> - Non-word character</div>
                    <div><span className="text-blue-600 dark:text-blue-400">\s</span> - Whitespace</div>
                    <div><span className="text-blue-600 dark:text-blue-400">\S</span> - Non-whitespace</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Quantifiers</Label>
                  <div className="bg-muted p-3 rounded-lg text-sm space-y-1 font-mono">
                    <div><span className="text-green-600 dark:text-green-400">*</span> - 0 or more</div>
                    <div><span className="text-green-600 dark:text-green-400">+</span> - 1 or more</div>
                    <div><span className="text-green-600 dark:text-green-400">?</span> - 0 or 1</div>
                    <div><span className="text-green-600 dark:text-green-400">{"n"}</span> - Exactly n</div>
                    <div><span className="text-green-600 dark:text-green-400">{"n,"}</span> - n or more</div>
                    <div><span className="text-green-600 dark:text-green-400">{"n,m"}</span> - Between n and m</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Anchors</Label>
                  <div className="bg-muted p-3 rounded-lg text-sm space-y-1 font-mono">
                    <div><span className="text-purple-600 dark:text-purple-400">^</span> - Start of string/line</div>
                    <div><span className="text-purple-600 dark:text-purple-400">$</span> - End of string/line</div>
                    <div><span className="text-purple-600 dark:text-purple-400">\b</span> - Word boundary</div>
                    <div><span className="text-purple-600 dark:text-purple-400">\B</span> - Non-word boundary</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Groups & Alternation</Label>
                  <div className="bg-muted p-3 rounded-lg text-sm space-y-1 font-mono">
                    <div><span className="text-orange-600 dark:text-orange-400">(abc)</span> - Capture group</div>
                    <div><span className="text-orange-600 dark:text-orange-400">(?:abc)</span> - Non-capturing group</div>
                    <div><span className="text-orange-600 dark:text-orange-400">a|b</span> - Match a or b</div>
                    <div><span className="text-orange-600 dark:text-orange-400">[abc]</span> - Character set</div>
                    <div><span className="text-orange-600 dark:text-orange-400">[^abc]</span> - Negated set</div>
                    <div><span className="text-orange-600 dark:text-orange-400">[a-z]</span> - Range</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
