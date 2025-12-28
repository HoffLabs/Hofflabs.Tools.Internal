"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState("0.8");
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

  const compress = () => {
    if (!file || !preview) return;
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `compressed_${file.name}`;
          link.click();
        }
      }, "image/jpeg", parseFloat(quality));
    };
    img.src = preview;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Compressor</CardTitle>
        <CardDescription>Compress images to reduce file size</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Image File</Label>
          <Input type="file" accept="image/*" onChange={handleFile} />
        </div>
        <div className="space-y-2">
          <Label>Quality (0.1 - 1.0)</Label>
          <Input type="number" min="0.1" max="1" step="0.1" value={quality} onChange={(e) => setQuality(e.target.value)} />
        </div>
        {preview && (
          <div>
            <p className="text-sm mb-2">Original: {(file!.size / 1024).toFixed(2)} KB</p>
            <img src={preview} alt="Preview" className="max-w-full max-h-64 object-contain" />
          </div>
        )}
        <Button onClick={compress} disabled={!file}>Compress & Download</Button>
      </CardContent>
    </Card>
  );
}
