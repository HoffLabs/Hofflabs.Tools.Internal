"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WhoisChecker() {
  const [domain, setDomain] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>WHOIS Checker</CardTitle>
        <CardDescription>Lookup domain registration information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Domain</Label>
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="example.com" />
        </div>
        <Button onClick={() => window.open(`https://who.is/whois/${domain}`, "_blank")} disabled={!domain}>
          Lookup on who.is
        </Button>
        <p className="text-xs text-muted-foreground">Opens WHOIS lookup in new tab (requires external service)</p>
      </CardContent>
    </Card>
  );
}
