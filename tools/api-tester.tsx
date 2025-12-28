"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApiTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("{}");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    setLoading(true);
    try {
      const options: RequestInit = { method };
      if (headers.trim()) {
        options.headers = JSON.parse(headers);
      }
      if (body.trim() && method !== "GET") {
        options.body = body;
      }
      
      const res = await fetch(url, options);
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
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Tester</CardTitle>
        <CardDescription>Test HTTP/REST APIs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>URL</Label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com" />
        </div>
        <div className="space-y-2">
          <Label>Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Headers (JSON)</Label>
          <Textarea value={headers} onChange={(e) => setHeaders(e.target.value)} rows={3} className="font-mono" />
        </div>
        {method !== "GET" && (
          <div className="space-y-2">
            <Label>Body</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="font-mono" />
          </div>
        )}
        <Button onClick={sendRequest} disabled={!url || loading}>
          {loading ? "Sending..." : "Send Request"}
        </Button>
        {response && (
          <div className="space-y-2">
            <Label>Response</Label>
            <Textarea value={response} readOnly rows={12} className="font-mono text-sm" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
