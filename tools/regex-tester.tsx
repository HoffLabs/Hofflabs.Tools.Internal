"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState("");

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches = [...testString.matchAll(regex)];
      setMatches(foundMatches);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex");
      setMatches([]);
    }
  };

  const highlightMatches = () => {
    if (!pattern || !testString || matches.length === 0) return testString;
    
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `▶${match}◀`);
    } catch {
      return testString;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Regex Tester</CardTitle>
          <CardDescription>Test regular expressions against text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pattern">Regular Expression</Label>
            <Input
              id="pattern"
              placeholder="[A-Z]\w+"
              value={pattern}
              onChange={(e) => {
                setPattern(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && testRegex()}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="flags">Flags</Label>
            <Input
              id="flags"
              placeholder="g, i, m, s, u, y"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="font-mono"
              maxLength={10}
            />
            <p className="text-xs text-muted-foreground">
              g=global, i=case-insensitive, m=multiline, s=dotAll, u=unicode, y=sticky
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testString">Test String</Label>
            <Textarea
              id="testString"
              placeholder="Enter text to test..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={6}
              className="font-mono"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
              {error}
            </div>
          )}

          {matches.length > 0 && (
            <div className="space-y-2">
              <Label>Matches: {matches.length}</Label>
              <div className="bg-muted p-3 rounded font-mono text-sm whitespace-pre-wrap">
                {highlightMatches()}
              </div>
              <div className="space-y-2">
                {matches.map((match, idx) => (
                  <div key={idx} className="bg-muted p-2 rounded text-sm">
                    <div className="font-semibold">Match {idx + 1}:</div>
                    <div className="font-mono">{match[0]}</div>
                    {match.length > 1 && (
                      <div className="text-muted-foreground text-xs mt-1">
                        Groups: {match.slice(1).join(", ")}
                      </div>
                    )}
                    <div className="text-muted-foreground text-xs">
                      Index: {match.index}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!error && pattern && testString && matches.length === 0 && (
            <p className="text-muted-foreground text-sm">No matches found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
