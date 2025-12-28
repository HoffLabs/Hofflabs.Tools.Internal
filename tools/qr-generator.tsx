"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState("200");
  const [qrUrl, setQrUrl] = useState("");

  const generateQR = () => {
    if (!text) return;
    // Using a free QR code API
    const encoded = encodeURIComponent(text);
    const sizeNum = parseInt(size) || 200;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${sizeNum}x${sizeNum}&data=${encoded}`);
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Generate QR codes from text or URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text or URL</Label>
            <Textarea
              id="text"
              placeholder="Enter text, URL, or any data..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size (pixels)</Label>
            <Input
              id="size"
              type="number"
              min="100"
              max="1000"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>

          <Button onClick={generateQR} disabled={!text}>
            Generate QR Code
          </Button>

          {qrUrl && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded">
                <img src={qrUrl} alt="QR Code" className="max-w-full" />
              </div>
              <Button onClick={downloadQR} variant="secondary" className="w-full">
                Download QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
