"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetadataCleaner() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata Cleaner</CardTitle>
        <CardDescription>Remove metadata from files</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This tool requires server-side processing or desktop application for proper metadata removal. 
          For images, you can use the Image Converter tool which strips most metadata during conversion.
        </p>
      </CardContent>
    </Card>
  );
}
