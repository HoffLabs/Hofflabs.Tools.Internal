"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ValidationResult {
  valid: boolean;
  message: string;
  formatted?: string;
  errorLine?: number;
  errorColumn?: number;
}

// Syntax highlighting for JSON
function highlightJson(json: string): React.ReactElement[] {
  const lines = json.split("\n");
  return lines.map((line, idx) => {
    // Highlight keys, strings, numbers, booleans, null
    const highlighted = line
      .replace(/("[^"]*")\s*:/g, '<span class="text-blue-600 dark:text-blue-400">$1</span>:')
      .replace(/:\s*("[^"]*")/g, ': <span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="text-orange-600 dark:text-orange-400">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="text-red-600 dark:text-red-400">$1</span>');
    
    return (
      <div key={idx} className="flex">
        <span className="w-10 text-right pr-3 text-muted-foreground select-none border-r mr-3">
          {idx + 1}
        </span>
        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    );
  });
}

// Syntax highlighting for XML
function highlightXml(xml: string): React.ReactElement[] {
  const lines = xml.split("\n");
  return lines.map((line, idx) => {
    const highlighted = line
      .replace(/(&lt;\/?)(\w+)/g, '$1<span class="text-blue-600 dark:text-blue-400">$2</span>')
      .replace(/(\w+)(=)/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>$2')
      .replace(/(="[^"]*")/g, '<span class="text-green-600 dark:text-green-400">$1</span>')
      .replace(/(<\/?)/g, '<span class="text-muted-foreground">$1</span>')
      .replace(/(\/>|>)/g, '<span class="text-muted-foreground">$1</span>');
    
    return (
      <div key={idx} className="flex">
        <span className="w-10 text-right pr-3 text-muted-foreground select-none border-r mr-3">
          {idx + 1}
        </span>
        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    );
  });
}

// Format XML with proper indentation
function formatXml(xml: string): string {
  const PADDING = "  ";
  let formatted = "";
  let pad = 0;
  
  // Remove existing whitespace between tags
  xml = xml.replace(/>\s+</g, "><");
  
  xml.split(/(<[^>]+>)/g).forEach((node) => {
    if (!node.trim()) return;
    
    if (node.match(/^<\?/)) {
      // XML declaration
      formatted += node + "\n";
    } else if (node.match(/^<\//)) {
      // Closing tag
      pad--;
      formatted += PADDING.repeat(Math.max(0, pad)) + node + "\n";
    } else if (node.match(/\/>$/)) {
      // Self-closing tag
      formatted += PADDING.repeat(pad) + node + "\n";
    } else if (node.match(/^</)) {
      // Opening tag
      formatted += PADDING.repeat(pad) + node + "\n";
      pad++;
    } else {
      // Text content
      formatted += PADDING.repeat(pad) + node + "\n";
    }
  });
  
  return formatted.trim();
}

// Code editor component with line numbers
function CodeEditor({
  value,
  onChange,
  placeholder,
  errorLine,
  readOnly = false,
}: {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  errorLine?: number;
  readOnly?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  const lines = value.split("\n");
  const lineCount = lines.length || 1;

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  return (
    <div className="border rounded-lg overflow-hidden bg-muted/30">
      <div className="flex max-h-[400px]">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="bg-muted/50 text-muted-foreground text-sm font-mono py-2 overflow-hidden select-none"
          style={{ minWidth: "3rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className={`px-2 text-right leading-6 ${
                errorLine === i + 1 ? "bg-red-500/20 text-red-600" : ""
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={`flex-1 font-mono text-sm p-2 bg-transparent resize-none focus:outline-none leading-6 overflow-auto ${
            readOnly ? "cursor-default" : ""
          }`}
          style={{ minHeight: "200px" }}
        />
      </div>
    </div>
  );
}

export default function JsonXmlValidatorImpl() {
  const [jsonInput, setJsonInput] = useState("");
  const [xmlInput, setXmlInput] = useState("");
  const [activeTab, setActiveTab] = useState("json");
  const [copied, setCopied] = useState(false);

  // JSON validation
  const jsonResult = useMemo((): ValidationResult => {
    if (!jsonInput.trim()) {
      return { valid: true, message: "" };
    }
    
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      return {
        valid: true,
        message: "Valid JSON",
        formatted,
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      // Try to extract line/column from error message
      const posMatch = msg.match(/position (\d+)/);
      let errorLine: number | undefined;
      
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const beforeError = jsonInput.substring(0, pos);
        errorLine = beforeError.split("\n").length;
      }
      
      return {
        valid: false,
        message: msg,
        errorLine,
      };
    }
  }, [jsonInput]);

  // XML validation
  const xmlResult = useMemo((): ValidationResult => {
    if (!xmlInput.trim()) {
      return { valid: true, message: "" };
    }
    
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlInput, "text/xml");
      const parseError = xmlDoc.querySelector("parsererror");
      
      if (parseError) {
        const errorText = parseError.textContent || "Parse error";
        const lineMatch = errorText.match(/line (\d+)/);
        const errorLine = lineMatch ? parseInt(lineMatch[1]) : undefined;
        
        return {
          valid: false,
          message: errorText,
          errorLine,
        };
      }
      
      const formatted = formatXml(xmlInput);
      return {
        valid: true,
        message: "Valid XML",
        formatted,
      };
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, [xmlInput]);

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const handleFormat = useCallback(() => {
    if (activeTab === "json" && jsonResult.formatted) {
      setJsonInput(jsonResult.formatted);
    } else if (activeTab === "xml" && xmlResult.formatted) {
      setXmlInput(xmlResult.formatted);
    }
  }, [activeTab, jsonResult.formatted, xmlResult.formatted]);

  const handleMinify = useCallback(() => {
    if (activeTab === "json" && jsonResult.valid && jsonInput) {
      try {
        const parsed = JSON.parse(jsonInput);
        setJsonInput(JSON.stringify(parsed));
      } catch {}
    } else if (activeTab === "xml" && xmlResult.valid && xmlInput) {
      setXmlInput(xmlInput.replace(/\s+/g, " ").replace(/> </g, "><").trim());
    }
  }, [activeTab, jsonResult.valid, xmlResult.valid, jsonInput, xmlInput]);

  const handleClear = useCallback(() => {
    if (activeTab === "json") {
      setJsonInput("");
    } else {
      setXmlInput("");
    }
  }, [activeTab]);

  // JSON to XML conversion
  const handleJsonToXml = useCallback(() => {
    if (!jsonResult.valid || !jsonInput) return;
    
    try {
      const parsed = JSON.parse(jsonInput);
      
      const jsonToXml = (obj: any, rootName = "root"): string => {
        let xml = "";
        
        if (Array.isArray(obj)) {
          obj.forEach((item) => {
            xml += `<item>${typeof item === "object" ? jsonToXml(item, "") : item}</item>`;
          });
        } else if (typeof obj === "object" && obj !== null) {
          for (const key in obj) {
            const value = obj[key];
            if (Array.isArray(value)) {
              xml += `<${key}>`;
              value.forEach((item) => {
                xml += `<item>${typeof item === "object" ? jsonToXml(item, "") : item}</item>`;
              });
              xml += `</${key}>`;
            } else if (typeof value === "object" && value !== null) {
              xml += `<${key}>${jsonToXml(value, "")}</${key}>`;
            } else {
              xml += `<${key}>${value}</${key}>`;
            }
          }
        } else {
          return String(obj);
        }
        
        return rootName ? `<${rootName}>${xml}</${rootName}>` : xml;
      };
      
      const xml = '<?xml version="1.0" encoding="UTF-8"?>' + jsonToXml(parsed);
      setXmlInput(formatXml(xml));
      setActiveTab("xml");
    } catch {}
  }, [jsonResult.valid, jsonInput]);

  const currentResult = activeTab === "json" ? jsonResult : xmlResult;
  const currentInput = activeTab === "json" ? jsonInput : xmlInput;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>JSON/XML Validator</CardTitle>
              <CardDescription>Validate, format, and convert JSON/XML with syntax highlighting</CardDescription>
            </div>
            {currentInput && (
              <Badge
                variant={currentResult.valid ? "default" : "destructive"}
                className={currentResult.valid ? "bg-green-500" : ""}
              >
                {currentResult.valid ? "✓ Valid" : "✗ Invalid"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="xml">XML</TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>JSON Input</Label>
                  <span className="text-xs text-muted-foreground">
                    {jsonInput.split("\n").length} lines, {jsonInput.length} chars
                  </span>
                </div>
                <CodeEditor
                  value={jsonInput}
                  onChange={setJsonInput}
                  placeholder='{\n  "key": "value"\n}'
                  errorLine={jsonResult.errorLine}
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleFormat} disabled={!jsonResult.formatted}>
                  Format
                </Button>
                <Button onClick={handleMinify} variant="secondary" disabled={!jsonResult.valid || !jsonInput}>
                  Minify
                </Button>
                <Button
                  onClick={() => handleCopy(jsonResult.formatted || jsonInput)}
                  variant="secondary"
                  disabled={!jsonInput}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={handleJsonToXml} variant="outline" disabled={!jsonResult.valid || !jsonInput}>
                  Convert to XML →
                </Button>
                <Button onClick={handleClear} variant="ghost" disabled={!jsonInput}>
                  Clear
                </Button>
              </div>
              
              {/* Error display */}
              {!jsonResult.valid && jsonResult.message && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-mono">
                  <div className="font-semibold mb-1">Error:</div>
                  {jsonResult.message}
                  {jsonResult.errorLine && (
                    <div className="mt-1 text-xs">Line: {jsonResult.errorLine}</div>
                  )}
                </div>
              )}
              
              {/* Formatted output preview */}
              {jsonResult.formatted && jsonInput !== jsonResult.formatted && (
                <div className="space-y-2">
                  <Label>Formatted Preview</Label>
                  <div className="border rounded-lg bg-muted/30 p-3 font-mono text-sm overflow-auto max-h-[300px]">
                    {highlightJson(jsonResult.formatted)}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="xml" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>XML Input</Label>
                  <span className="text-xs text-muted-foreground">
                    {xmlInput.split("\n").length} lines, {xmlInput.length} chars
                  </span>
                </div>
                <CodeEditor
                  value={xmlInput}
                  onChange={setXmlInput}
                  placeholder='<?xml version="1.0"?>\n<root>\n  <item>value</item>\n</root>'
                  errorLine={xmlResult.errorLine}
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleFormat} disabled={!xmlResult.formatted}>
                  Format
                </Button>
                <Button onClick={handleMinify} variant="secondary" disabled={!xmlResult.valid || !xmlInput}>
                  Minify
                </Button>
                <Button
                  onClick={() => handleCopy(xmlResult.formatted || xmlInput)}
                  variant="secondary"
                  disabled={!xmlInput}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={handleClear} variant="ghost" disabled={!xmlInput}>
                  Clear
                </Button>
              </div>
              
              {/* Error display */}
              {!xmlResult.valid && xmlResult.message && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-mono">
                  <div className="font-semibold mb-1">Error:</div>
                  {xmlResult.message}
                  {xmlResult.errorLine && (
                    <div className="mt-1 text-xs">Line: {xmlResult.errorLine}</div>
                  )}
                </div>
              )}
              
              {/* Formatted output preview */}
              {xmlResult.formatted && xmlInput !== xmlResult.formatted && (
                <div className="space-y-2">
                  <Label>Formatted Preview</Label>
                  <div className="border rounded-lg bg-muted/30 p-3 font-mono text-sm overflow-auto max-h-[300px]">
                    {highlightXml(xmlResult.formatted)}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
