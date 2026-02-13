"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface HistoryItem {
  id: string;
  url: string;
  method: string;
  headers: string;
  body: string;
  timestamp: number;
  status?: number;
}

const HISTORY_KEY = "api-tester-history";
const MAX_HISTORY = 20;

export default function ApiTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("{}");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (items: HistoryItem[]) => {
    setHistory(items);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  };

  const addToHistory = (status?: number) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      url,
      method,
      headers,
      body,
      timestamp: Date.now(),
      status,
    };
    const newHistory = [item, ...history.filter(h => h.url !== url || h.method !== method)].slice(0, MAX_HISTORY);
    saveHistory(newHistory);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setUrl(item.url);
    setMethod(item.method);
    setHeaders(item.headers);
    setBody(item.body);
    setShowHistory(false);
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const removeFromHistory = (id: string) => {
    saveHistory(history.filter(h => h.id !== id));
  };

  const sendRequest = async () => {
    setLoading(true);
    let status: number | undefined;
    try {
      const options: RequestInit = { method };
      if (headers.trim()) {
        options.headers = JSON.parse(headers);
      }
      if (body.trim() && method !== "GET") {
        options.body = body;
      }
      
      const res = await fetch(url, options);
      status = res.status;
      const text = await res.text();
      const result = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: text
      };
      setResponse(JSON.stringify(result, null, 2));
    } catch (err) {
      setResponse(`Error: ${err instanceof Error ? err.message : "Request failed"}`);
    }
    addToHistory(status);
    setLoading(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getMethodColor = (m: string) => {
    switch (m) {
      case "GET": return "bg-green-500";
      case "POST": return "bg-blue-500";
      case "PUT": return "bg-yellow-500";
      case "DELETE": return "bg-red-500";
      case "PATCH": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>API Tester</CardTitle>
              <CardDescription>Test HTTP/REST APIs</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              History ({history.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* History Panel */}
          {showHistory && history.length > 0 && (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Request History</Label>
                <Button variant="ghost" size="sm" onClick={clearHistory} className="text-destructive hover:text-destructive">
                  Clear All
                </Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center gap-2 p-2 bg-background rounded border hover:border-primary cursor-pointer group"
                    onClick={() => loadFromHistory(item)}
                  >
                    <Badge className={`${getMethodColor(item.method)} text-white text-xs`}>
                      {item.method}
                    </Badge>
                    <span className="flex-1 font-mono text-sm truncate">{item.url}</span>
                    {item.status && (
                      <Badge variant={item.status < 400 ? "secondary" : "destructive"} className="text-xs">
                        {item.status}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {formatTime(item.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.id);
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="w-32">
              <Label>Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>URL</Label>
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="https://api.example.com/endpoint" 
                className="mt-1.5 font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Headers (JSON)</Label>
            <Textarea 
              value={headers} 
              onChange={(e) => setHeaders(e.target.value)} 
              rows={3} 
              className="font-mono text-sm"
              placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
            />
          </div>

          {method !== "GET" && method !== "HEAD" && (
            <div className="space-y-2">
              <Label>Request Body</Label>
              <Textarea 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                rows={6} 
                className="font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            </div>
          )}

          <Button onClick={sendRequest} disabled={!url || loading} className="w-full sm:w-auto">
            {loading ? "Sending..." : "Send Request"}
          </Button>

          {response && (
            <div className="space-y-2">
              <Label>Response</Label>
              <Textarea value={response} readOnly rows={14} className="font-mono text-sm" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
