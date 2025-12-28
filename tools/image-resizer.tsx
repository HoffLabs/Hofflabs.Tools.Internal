"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [preview, setPreview] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const resize = () => {
    if (!file || !preview) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      const w = parseInt(width) || img.width;
      const h = parseInt(height) || img.height;
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `resized_${file.name}`;
          link.click();
        }
      });
    };
    img.src = preview;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Resizer</CardTitle>
        <CardDescription>Resize images to specific dimensions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Image File</Label>
          <Input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="800" />
          </div>
          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="600" />
          </div>
        </div>
        {preview && <img src={preview} alt="Preview" className="max-w-full max-h-64 object-contain" />}
        <Button onClick={resize} disabled={!file}>Resize & Download</Button>
      </CardContent>
    </Card>
  );
}
