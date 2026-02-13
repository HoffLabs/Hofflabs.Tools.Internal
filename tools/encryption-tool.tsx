"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

// MD5 implementation (client-side)
function md5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX: number, lY: number) {
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else return lResult ^ lX8 ^ lY8;
  }

  function f(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function g(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function h(x: number, y: number, z: number) { return x ^ y ^ z; }
  function i(x: number, y: number, z: number) { return y ^ (x | ~z); }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(string: string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number) {
    let wordToHexValue = "";
    for (let lCount = 0; lCount <= 3; lCount++) {
      const lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue = wordToHexValue + ("0" + lByte.toString(16)).slice(-2);
    }
    return wordToHexValue;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = ff(a, b, c, d, x[k], S11, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = gg(b, c, d, a, x[k], S24, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = hh(d, a, b, c, x[k], S32, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6], S34, 0x4881d05);
    a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = ii(a, b, c, d, x[k], S41, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

export default function EncryptionTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [hashAlgorithm, setHashAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [aesKey, setAesKey] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const clearAll = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  // Base64
  const base64Encode = useCallback(() => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
      setError("");
    } catch (e) {
      setError("Failed to encode Base64");
    }
  }, [input]);

  const base64Decode = useCallback(() => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
      setError("");
    } catch (e) {
      setError("Invalid Base64 string");
    }
  }, [input]);

  // URL encoding
  const urlEncode = useCallback(() => {
    try {
      setOutput(encodeURIComponent(input));
      setError("");
    } catch (e) {
      setError("Failed to URL encode");
    }
  }, [input]);

  const urlDecode = useCallback(() => {
    try {
      setOutput(decodeURIComponent(input));
      setError("");
    } catch (e) {
      setError("Invalid URL encoded string");
    }
  }, [input]);

  // HTML entities
  const htmlEncode = useCallback(() => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    setOutput(input.replace(/[&<>"']/g, (m) => map[m]));
    setError("");
  }, [input]);

  const htmlDecode = useCallback(() => {
    const map: Record<string, string> = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#039;": "'",
      "&#39;": "'",
    };
    setOutput(input.replace(/&amp;|&lt;|&gt;|&quot;|&#0?39;/g, (m) => map[m] || m));
    setError("");
  }, [input]);

  // Hex encoding
  const hexEncode = useCallback(() => {
    const hex = Array.from(input)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
    setOutput(hex);
    setError("");
  }, [input]);

  const hexDecode = useCallback(() => {
    try {
      const hex = input.replace(/\s/g, "");
      if (!/^[0-9a-fA-F]*$/.test(hex)) throw new Error("Invalid hex");
      let result = "";
      for (let i = 0; i < hex.length; i += 2) {
        result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      setOutput(result);
      setError("");
    } catch (e) {
      setError("Invalid hex string");
    }
  }, [input]);

  // Hash functions
  const computeHash = useCallback(async () => {
    try {
      if (hashAlgorithm === "MD5") {
        setOutput(md5(input));
      } else {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest(hashAlgorithm, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        setOutput(hashHex);
      }
      setError("");
    } catch (e) {
      setError("Failed to compute hash");
    }
  }, [input, hashAlgorithm]);

  // AES encryption (using Web Crypto API)
  const aesEncrypt = useCallback(async () => {
    try {
      if (!aesKey) {
        setError("Please enter an encryption key");
        return;
      }
      
      const encoder = new TextEncoder();
      const keyData = encoder.encode(aesKey.padEnd(32, "0").slice(0, 32));
      const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt"]);
      
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(input)
      );
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      setOutput(btoa(String.fromCharCode(...combined)));
      setError("");
    } catch (e) {
      setError("Failed to encrypt");
    }
  }, [input, aesKey]);

  const aesDecrypt = useCallback(async () => {
    try {
      if (!aesKey) {
        setError("Please enter the decryption key");
        return;
      }
      
      const encoder = new TextEncoder();
      const keyData = encoder.encode(aesKey.padEnd(32, "0").slice(0, 32));
      const key = await crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["decrypt"]);
      
      const combined = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
      );
      
      setOutput(new TextDecoder().decode(decrypted));
      setError("");
    } catch (e) {
      setError("Failed to decrypt. Check your key and input.");
    }
  }, [input, aesKey]);

  // JWT decode
  const jwtDecode = useCallback(() => {
    try {
      const parts = input.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT format");
      
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      setOutput(JSON.stringify({ header, payload }, null, 2));
      setError("");
    } catch (e) {
      setError("Invalid JWT token");
    }
  }, [input]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encoding & Hashing Tool</CardTitle>
        <CardDescription>Encode, decode, hash, and encrypt text using various methods</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Input</Label>
            <span className="text-xs text-muted-foreground">{input.length} chars</span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to encode, decode, or hash..."
            rows={5}
            className="font-mono"
            spellCheck={false}
          />
        </div>

        <Tabs defaultValue="encoding" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="encoding">Encoding</TabsTrigger>
            <TabsTrigger value="hashing">Hashing</TabsTrigger>
            <TabsTrigger value="encryption">AES</TabsTrigger>
            <TabsTrigger value="jwt">JWT</TabsTrigger>
          </TabsList>

          <TabsContent value="encoding" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="space-y-2 col-span-2 md:col-span-3">
                <Label className="text-xs text-muted-foreground">Base64</Label>
                <div className="flex gap-2">
                  <Button onClick={base64Encode} variant="outline" size="sm">Encode</Button>
                  <Button onClick={base64Decode} variant="outline" size="sm">Decode</Button>
                </div>
              </div>
              
              <div className="space-y-2 col-span-2 md:col-span-3">
                <Label className="text-xs text-muted-foreground">URL Encoding</Label>
                <div className="flex gap-2">
                  <Button onClick={urlEncode} variant="outline" size="sm">Encode</Button>
                  <Button onClick={urlDecode} variant="outline" size="sm">Decode</Button>
                </div>
              </div>
              
              <div className="space-y-2 col-span-2 md:col-span-3">
                <Label className="text-xs text-muted-foreground">HTML Entities</Label>
                <div className="flex gap-2">
                  <Button onClick={htmlEncode} variant="outline" size="sm">Encode</Button>
                  <Button onClick={htmlDecode} variant="outline" size="sm">Decode</Button>
                </div>
              </div>
              
              <div className="space-y-2 col-span-2 md:col-span-3">
                <Label className="text-xs text-muted-foreground">Hexadecimal</Label>
                <div className="flex gap-2">
                  <Button onClick={hexEncode} variant="outline" size="sm">Encode</Button>
                  <Button onClick={hexDecode} variant="outline" size="sm">Decode</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hashing" className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Algorithm</Label>
                <Select value={hashAlgorithm} onValueChange={(v) => setHashAlgorithm(v as HashAlgorithm)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MD5">MD5</SelectItem>
                    <SelectItem value="SHA-1">SHA-1</SelectItem>
                    <SelectItem value="SHA-256">SHA-256</SelectItem>
                    <SelectItem value="SHA-384">SHA-384</SelectItem>
                    <SelectItem value="SHA-512">SHA-512</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={computeHash}>Compute Hash</Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">MD5</Badge> 128-bit (not secure for passwords)
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">SHA-1</Badge> 160-bit (deprecated)
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">SHA-256</Badge> 256-bit (recommended)
              </div>
            </div>
          </TabsContent>

          <TabsContent value="encryption" className="space-y-4">
            <div className="space-y-2">
              <Label>Encryption Key</Label>
              <Input
                type="password"
                value={aesKey}
                onChange={(e) => setAesKey(e.target.value)}
                placeholder="Enter a secret key..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Uses AES-256-GCM encryption. Keep your key safe - you&apos;ll need it to decrypt.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={aesEncrypt}>Encrypt</Button>
              <Button onClick={aesDecrypt} variant="secondary">Decrypt</Button>
            </div>
          </TabsContent>

          <TabsContent value="jwt" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Decode a JWT token to view its header and payload. Note: This does not verify the signature.
            </p>
            <Button onClick={jwtDecode}>Decode JWT</Button>
          </TabsContent>
        </Tabs>

        {/* Error display */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Output</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{output.length} chars</span>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              rows={6}
              className="font-mono bg-muted/30"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
