"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Invalid input"}`);
    }
  };

  const decode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Invalid URL encoded string"}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>URL Encoder/Decoder</CardTitle>
          <CardDescription>Encode or decode URL strings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Textarea
              id="input"
              placeholder="Enter URL to encode or encoded URL to decode"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={encode}>Encode</Button>
            <Button onClick={decode} variant="secondary">
              Decode
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="output">Output</Label>
            <Textarea
              id="output"
              value={output}
              readOnly
              rows={6}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
