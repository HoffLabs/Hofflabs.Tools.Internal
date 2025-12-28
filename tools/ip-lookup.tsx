"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IpLookup() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://ipapi.co/${ip || "json"}/json/`);
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      setInfo({ error: "Failed to lookup IP" });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Address Lookup</CardTitle>
        <CardDescription>Get information about an IP address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>IP Address (leave empty for your IP)</Label>
          <Input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="8.8.8.8" />
        </div>
        <Button onClick={lookup} disabled={loading}>{loading ? "Looking up..." : "Lookup"}</Button>
        {info && (
          <div className="space-y-2">
            {info.error ? (
              <p className="text-destructive">{info.error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>IP:</strong> {info.ip}</div>
                <div><strong>City:</strong> {info.city}</div>
                <div><strong>Region:</strong> {info.region}</div>
                <div><strong>Country:</strong> {info.country_name}</div>
                <div><strong>ISP:</strong> {info.org}</div>
                <div><strong>Timezone:</strong> {info.timezone}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
