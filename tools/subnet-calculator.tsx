"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SubnetCalculator() {
  const [ip, setIp] = useState("");
  const [cidr, setCidr] = useState("24");
  const [result, setResult] = useState<any>(null);

  const calculateSubnet = () => {
    try {
      const octets = ip.split(".").map(Number);
      if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        setResult({ error: "Invalid IP address" });
        return;
      }

      const maskBits = parseInt(cidr);
      if (isNaN(maskBits) || maskBits < 0 || maskBits > 32) {
        setResult({ error: "Invalid CIDR (0-32)" });
        return;
      }

      const ipBinary = octets.map((o) => o.toString(2).padStart(8, "0")).join("");
      const maskBinary = "1".repeat(maskBits) + "0".repeat(32 - maskBits);
      
      const networkBinary = ipBinary.split("").map((bit, i) => 
        bit === "1" && maskBinary[i] === "1" ? "1" : "0"
      ).join("");
      
      const broadcastBinary = networkBinary.split("").map((bit, i) => 
        maskBinary[i] === "1" ? bit : "1"
      ).join("");

      const binaryToIp = (binary: string) => {
        const result = [];
        for (let i = 0; i < 32; i += 8) {
          result.push(parseInt(binary.slice(i, i + 8), 2));
        }
        return result.join(".");
      };

      const subnetMask = binaryToIp(maskBinary);
      const networkAddress = binaryToIp(networkBinary);
      const broadcastAddress = binaryToIp(broadcastBinary);
      
      const networkNum = parseInt(networkBinary, 2);
      const broadcastNum = parseInt(broadcastBinary, 2);
      const firstUsable = binaryToIp((networkNum + 1).toString(2).padStart(32, "0"));
      const lastUsable = binaryToIp((broadcastNum - 1).toString(2).padStart(32, "0"));
      
      const totalHosts = Math.pow(2, 32 - maskBits);
      const usableHosts = totalHosts - 2;

      setResult({
        networkAddress,
        broadcastAddress,
        subnetMask,
        firstUsable,
        lastUsable,
        totalHosts,
        usableHosts,
        cidr: `/${maskBits}`,
        wildcardMask: subnetMask.split(".").map((o) => 255 - parseInt(o)).join(".")
      });
    } catch (error) {
      setResult({ error: "Calculation error" });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Subnet Calculator</CardTitle>
          <CardDescription>Calculate and validate network subnets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                placeholder="192.168.1.1"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidr">CIDR Prefix</Label>
              <Input
                id="cidr"
                type="number"
                min="0"
                max="32"
                placeholder="24"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={calculateSubnet}>Calculate</Button>

          {result && (
            <div className="space-y-2 mt-4">
              {result.error ? (
                <p className="text-destructive">{result.error}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-muted-foreground">Network Address</Label>
                    <p className="font-mono font-semibold">{result.networkAddress}{result.cidr}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Broadcast Address</Label>
                    <p className="font-mono font-semibold">{result.broadcastAddress}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Subnet Mask</Label>
                    <p className="font-mono font-semibold">{result.subnetMask}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Wildcard Mask</Label>
                    <p className="font-mono font-semibold">{result.wildcardMask}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">First Usable IP</Label>
                    <p className="font-mono font-semibold">{result.firstUsable}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Usable IP</Label>
                    <p className="font-mono font-semibold">{result.lastUsable}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Hosts</Label>
                    <p className="font-mono font-semibold">{result.totalHosts.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Usable Hosts</Label>
                    <p className="font-mono font-semibold">{result.usableHosts.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
