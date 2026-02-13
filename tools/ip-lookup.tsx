"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IpLookup() {
  const [ip, setIp] = useState("");
  const [myIp, setMyIp] = useState<string | null>(null);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Auto-detect user's IP on mount
  useEffect(() => {
    const detectIp = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.ip) {
          setMyIp(data.ip);
          setIp(data.ip);
          setInfo(data);
        }
      } catch (err) {
        // Silently fail - user can still enter IP manually
      } finally {
        setInitialLoading(false);
      }
    };
    detectIp();
  }, []);

  const lookup = async (targetIp?: string) => {
    const ipToLookup = targetIp || ip;
    setLoading(true);
    try {
      const res = await fetch(`https://ipapi.co/${ipToLookup || "json"}/json/`);
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      setInfo({ error: "Failed to lookup IP" });
    }
    setLoading(false);
  };

  const useMyIp = () => {
    if (myIp) {
      setIp(myIp);
      lookup(myIp);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Address Lookup</CardTitle>
        <CardDescription>Get geolocation and network information for any IP address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {initialLoading ? (
          <div className="text-muted-foreground text-sm">Detecting your IP address...</div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>IP Address</Label>
                {myIp && (
                  <Button variant="ghost" size="sm" onClick={useMyIp} className="h-6 text-xs">
                    Use my IP ({myIp})
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={ip} 
                  onChange={(e) => setIp(e.target.value)} 
                  placeholder="Enter IP address (e.g., 8.8.8.8)" 
                  className="font-mono"
                  onKeyDown={(e) => e.key === "Enter" && lookup()}
                />
                <Button onClick={() => lookup()} disabled={loading}>
                  {loading ? "Looking up..." : "Lookup"}
                </Button>
              </div>
            </div>

            {info && (
              <div className="space-y-4">
                {info.error ? (
                  <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
                    {info.error}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-lg font-mono py-1 px-3">
                        {info.ip}
                      </Badge>
                      {info.ip === myIp && (
                        <Badge variant="secondary">Your IP</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm border-b pb-1">Location</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">City</span>
                            <span>{info.city || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Region</span>
                            <span>{info.region || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Country</span>
                            <span>{info.country_name || "N/A"} {info.country_code && `(${info.country_code})`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Postal Code</span>
                            <span>{info.postal || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Coordinates</span>
                            <span>{info.latitude && info.longitude ? `${info.latitude}, ${info.longitude}` : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm border-b pb-1">Network</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ISP / Org</span>
                            <span className="text-right max-w-[200px] truncate">{info.org || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ASN</span>
                            <span>{info.asn || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Timezone</span>
                            <span>{info.timezone || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">UTC Offset</span>
                            <span>{info.utc_offset || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Currency</span>
                            <span>{info.currency_name || "N/A"} {info.currency && `(${info.currency})`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
