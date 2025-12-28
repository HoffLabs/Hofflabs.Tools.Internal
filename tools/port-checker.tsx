"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PortChecker() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [result, setResult] = useState("");

  const checkPort = async () => {
    setResult("Checking...");
    try {
      const response = await fetch(`https://${host}:${port}`, {
        mode: "no-cors",
        signal: AbortSignal.timeout(3000)
      });
      setResult(`Port ${port} appears to be open`);
    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        setResult(`Port ${port} is likely closed or filtered`);
      } else {
        setResult(`Unable to check port (browser limitations)`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Port Checker</CardTitle>
        <CardDescription>Check if a port is open (limited by browser)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Host</Label>
          <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="example.com" />
        </div>
        <div className="space-y-2">
          <Label>Port</Label>
          <Input type="number" value={port} onChange={(e) => setPort(e.target.value)} placeholder="80" />
        </div>
        <Button onClick={checkPort} disabled={!host || !port}>Check Port</Button>
        {result && <p className="text-sm">{result}</p>}
        <p className="text-xs text-muted-foreground">Note: Browser security limitations may affect results</p>
      </CardContent>
    </Card>
  );
}
