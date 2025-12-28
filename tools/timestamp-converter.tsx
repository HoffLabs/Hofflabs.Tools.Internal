"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [isoDate, setIsoDate] = useState("");
  const [localDate, setLocalDate] = useState("");
  const [utcDate, setUtcDate] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertFromTimestamp = (ts: string) => {
    try {
      const num = parseInt(ts);
      // Check if it's in seconds (10 digits) or milliseconds (13 digits)
      const date = new Date(num.toString().length === 10 ? num * 1000 : num);
      setIsoDate(date.toISOString());
      setLocalDate(date.toLocaleString());
      setUtcDate(date.toUTCString());
    } catch (error) {
      setIsoDate("Invalid timestamp");
      setLocalDate("Invalid timestamp");
      setUtcDate("Invalid timestamp");
    }
  };

  const convertFromIso = (iso: string) => {
    try {
      const date = new Date(iso);
      setTimestamp(date.getTime().toString());
      setLocalDate(date.toLocaleString());
      setUtcDate(date.toUTCString());
    } catch (error) {
      setTimestamp("Invalid date");
    }
  };

  const useCurrentTime = () => {
    const now = Date.now();
    setTimestamp(now.toString());
    convertFromTimestamp(now.toString());
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Timestamp Converter</CardTitle>
          <CardDescription>Convert between timestamp formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-2">Current Unix Timestamp</div>
            <div className="text-2xl font-mono font-bold">{currentTime}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {new Date(currentTime).toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timestamp">Unix Timestamp (seconds or milliseconds)</Label>
              <div className="flex gap-2">
                <Input
                  id="timestamp"
                  placeholder="1640000000000"
                  value={timestamp}
                  onChange={(e) => {
                    setTimestamp(e.target.value);
                    convertFromTimestamp(e.target.value);
                  }}
                />
                <Button onClick={useCurrentTime} variant="secondary">
                  Now
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iso">ISO 8601</Label>
              <Input
                id="iso"
                value={isoDate}
                onChange={(e) => {
                  setIsoDate(e.target.value);
                  convertFromIso(e.target.value);
                }}
                placeholder="2021-12-20T12:00:00.000Z"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="local">Local Time</Label>
              <Input
                id="local"
                value={localDate}
                readOnly
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utc">UTC Time</Label>
              <Input
                id="utc"
                value={utcDate}
                readOnly
                className="font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
