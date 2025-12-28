"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [md5, setMd5] = useState("");
  const [sha1, setSha1] = useState("");
  const [sha256, setSha256] = useState("");

  const generateHashes = async (text: string) => {
    setInput(text);
    
    if (!text) {
      setMd5("");
      setSha1("");
      setSha256("");
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // SHA-1
    const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
    setSha1(Array.from(new Uint8Array(sha1Buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join(""));

    // SHA-256
    const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
    setSha256(Array.from(new Uint8Array(sha256Buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join(""));

    // MD5 is not available in Web Crypto API, showing note
    setMd5("MD5 requires external library - use SHA-256 instead (more secure)");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator</CardTitle>
          <CardDescription>Generate cryptographic hashes from text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input Text</Label>
            <Textarea
              id="input"
              placeholder="Enter text to hash"
              value={input}
              onChange={(e) => generateHashes(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="md5">MD5</Label>
            <Input
              id="md5"
              value={md5}
              readOnly
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sha1">SHA-1</Label>
            <Input
              id="sha1"
              value={sha1}
              readOnly
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sha256">SHA-256</Label>
            <Input
              id="sha256"
              value={sha256}
              readOnly
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
