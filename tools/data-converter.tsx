"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const jsonToCsv = () => {
    try {
      const data = JSON.parse(input);
      const array = Array.isArray(data) ? data : [data];
      if (array.length === 0) {
        setOutput("Empty array");
        return;
      }
      const keys = Object.keys(array[0]);
      const csv = [
        keys.join(","),
        ...array.map(row => keys.map(k => JSON.stringify(row[k] || "")).join(","))
      ].join("\n");
      setOutput(csv);
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : "Invalid JSON"}`);
    }
  };

  const csvToJson = () => {
    try {
      const lines = input.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const values = line.split(",");
        return headers.reduce((obj: any, header, idx) => {
          obj[header] = values[idx]?.trim() || "";
          return obj;
        }, {});
      });
      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : "Invalid CSV"}`);
    }
  };

  const jsonToXml = () => {
    try {
      const data = JSON.parse(input);
      const toXml = (obj: any, indent = 0): string => {
        const spaces = "  ".repeat(indent);
        if (Array.isArray(obj)) {
          return obj.map(item => toXml(item, indent)).join("\n");
        }
        if (typeof obj === "object" && obj !== null) {
          return Object.entries(obj).map(([key, value]) => {
            if (typeof value === "object") {
              return `${spaces}<${key}>\n${toXml(value, indent + 1)}\n${spaces}</${key}>`;
            }
            return `${spaces}<${key}>${value}</${key}>`;
          }).join("\n");
        }
        return String(obj);
      };
      setOutput(`<?xml version="1.0"?>\n<root>\n${toXml(data, 1)}\n</root>`);
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : "Invalid JSON"}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Converter</CardTitle>
        <CardDescription>Convert between JSON, CSV, and XML</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json-csv">
          <TabsList>
            <TabsTrigger value="json-csv">JSON ↔ CSV</TabsTrigger>
            <TabsTrigger value="json-xml">JSON → XML</TabsTrigger>
          </TabsList>
          <TabsContent value="json-csv" className="space-y-4">
            <Textarea placeholder="Input" value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="font-mono" />
            <div className="flex gap-2">
              <Button onClick={jsonToCsv}>JSON to CSV</Button>
              <Button onClick={csvToJson} variant="secondary">CSV to JSON</Button>
            </div>
            <Textarea placeholder="Output" value={output} readOnly rows={8} className="font-mono" />
          </TabsContent>
          <TabsContent value="json-xml" className="space-y-4">
            <Textarea placeholder="Enter JSON" value={input} onChange={(e) => setInput(e.target.value)} rows={8} className="font-mono" />
            <Button onClick={jsonToXml}>Convert to XML</Button>
            <Textarea placeholder="XML Output" value={output} readOnly rows={8} className="font-mono" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
