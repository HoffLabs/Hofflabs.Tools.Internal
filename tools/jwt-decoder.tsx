"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function JwtDecoder() {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState("");

  const decodeJwt = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        setError("Invalid JWT format");
        setDecoded(null);
        return;
      }

      const header = JSON.parse(atob(parts[0].replace(/-/g, "+").replace(/_/g, "/")));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));

      setDecoded({
        header,
        payload,
        signature: parts[2],
      });
      setError("");
    } catch (err) {
      setError("Failed to decode JWT");
      setDecoded(null);
    }
  };

  const handleChange = (value: string) => {
    setJwt(value);
    if (value.trim()) {
      decodeJwt(value.trim());
    } else {
      setDecoded(null);
      setError("");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>JWT Decoder</CardTitle>
          <CardDescription>Decode and inspect JWT tokens (client-side only)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jwt">JWT Token</Label>
            <Textarea
              id="jwt"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={jwt}
              onChange={(e) => handleChange(e.target.value)}
              rows={4}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
              {error}
            </div>
          )}

          {decoded && (
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">Header</Label>
                <pre className="bg-muted p-3 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(decoded.header, null, 2)}
                </pre>
              </div>

              <div>
                <Label className="text-lg font-semibold">Payload</Label>
                <pre className="bg-muted p-3 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(decoded.payload, null, 2)}
                </pre>
                
                {decoded.payload.exp && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Expires: </span>
                    <span className={new Date(decoded.payload.exp * 1000) < new Date() ? "text-destructive" : ""}>
                      {new Date(decoded.payload.exp * 1000).toLocaleString()}
                      {new Date(decoded.payload.exp * 1000) < new Date() && " (Expired)"}
                    </span>
                  </div>
                )}

                {decoded.payload.iat && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Issued: </span>
                    {new Date(decoded.payload.iat * 1000).toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-lg font-semibold">Signature</Label>
                <div className="bg-muted p-3 rounded mt-2 text-sm font-mono break-all">
                  {decoded.signature}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Signature verification requires server-side processing
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
