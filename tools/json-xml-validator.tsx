"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function JsonXmlValidatorImpl() {
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [xmlInput, setXmlInput] = useState("");
  const [xmlOutput, setXmlOutput] = useState("");

  const validateJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonOutput(`✓ Valid JSON\n\n${formatted}`);
    } catch (error) {
      setJsonOutput(`✗ Invalid JSON\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonOutput(`✓ Minified JSON\n\n${minified}`);
    } catch (error) {
      setJsonOutput(`✗ Invalid JSON\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const validateXml = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlInput, "text/xml");
      const parseError = xmlDoc.querySelector("parsererror");
      
      if (parseError) {
        setXmlOutput(`✗ Invalid XML\n\n${parseError.textContent}`);
      } else {
        // Format XML
        const serializer = new XMLSerializer();
        const formatted = serializer.serializeToString(xmlDoc);
        setXmlOutput(`✓ Valid XML\n\n${formatted}`);
      }
    } catch (error) {
      setXmlOutput(`✗ Invalid XML\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>JSON/XML Validator</CardTitle>
          <CardDescription>Validate and format JSON or XML</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="json">
            <TabsList>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="xml">XML</TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">JSON Input</Label>
                <Textarea
                  id="json-input"
                  placeholder='{"key": "value"}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={8}
                  className="font-mono"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={validateJson}>Validate & Format</Button>
                <Button onClick={minifyJson} variant="secondary">
                  Minify
                </Button>
              </div>
              {jsonOutput && (
                <div className="space-y-2">
                  <Label htmlFor="json-output">Output</Label>
                  <Textarea
                    id="json-output"
                    value={jsonOutput}
                    readOnly
                    rows={10}
                    className="font-mono"
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="xml" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="xml-input">XML Input</Label>
                <Textarea
                  id="xml-input"
                  placeholder='<?xml version="1.0"?><root><item>value</item></root>'
                  value={xmlInput}
                  onChange={(e) => setXmlInput(e.target.value)}
                  rows={8}
                  className="font-mono"
                />
              </div>
              <Button onClick={validateXml}>Validate</Button>
              {xmlOutput && (
                <div className="space-y-2">
                  <Label htmlFor="xml-output">Output</Label>
                  <Textarea
                    id="xml-output"
                    value={xmlOutput}
                    readOnly
                    rows={10}
                    className="font-mono"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
