"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EncryptionTool() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");

  const caesarEncrypt = () => {
    const shift = parseInt(key) || 3;
    const result = text.split("").map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpper = code >= 65 && code <= 90;
        const base = isUpper ? 65 : 97;
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    }).join("");
    setOutput(result);
  };

  const caesarDecrypt = () => {
    const shift = -(parseInt(key) || 3);
    const result = text.split("").map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpper = code >= 65 && code <= 90;
        const base = isUpper ? 65 : 97;
        return String.fromCharCode(((code - base + shift + 26) % 26) + base);
      }
      return char;
    }).join("");
    setOutput(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encryption Tool</CardTitle>
        <CardDescription>Simple Caesar cipher encryption/decryption</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Text</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        </div>
        <div className="space-y-2">
          <Label>Shift Key (number)</Label>
          <Input type="number" value={key} onChange={(e) => setKey(e.target.value)} placeholder="3" />
        </div>
        <div className="flex gap-2">
          <Button onClick={caesarEncrypt}>Encrypt</Button>
          <Button onClick={caesarDecrypt} variant="secondary">Decrypt</Button>
        </div>
        <div className="space-y-2">
          <Label>Output</Label>
          <Textarea value={output} readOnly rows={4} className="font-mono" />
        </div>
        <p className="text-xs text-muted-foreground">Note: This is a simple Caesar cipher for demonstration. Use proper encryption for sensitive data.</p>
      </CardContent>
    </Card>
  );
}
