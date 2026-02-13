import { Tool } from "./types/tool";
import { isPublicMode } from "./site-config";

// Import all tools here
import SubnetCalculator from "@/tools/subnet-calculator";
import DiffTool from "@/tools/diff-tool";
import JsonXmlValidator from "@/tools/json-xml-validator";
import ApiTester from "@/tools/api-tester";
import PortChecker from "@/tools/port-checker";
import IpLookup from "@/tools/ip-lookup";
import WhoisChecker from "@/tools/whois-checker";
import DataConverter from "@/tools/data-converter";
import EncryptionTool from "@/tools/encryption-tool";
import ImageConverter from "@/tools/image-converter";
import ImageCompressor from "@/tools/image-compressor";
import ImageResizer from "@/tools/image-resizer";
import MetadataCleaner from "@/tools/metadata-cleaner";
import Base64Tool from "@/tools/base64-tool";
import UrlEncoder from "@/tools/url-encoder";
import HashGenerator from "@/tools/hash-generator";
import RegexTester from "@/tools/regex-tester";
import TimestampConverter from "@/tools/timestamp-converter";
import QrGenerator from "@/tools/qr-generator";
import JwtDecoder from "@/tools/jwt-decoder";

/**
 * Tool Registry
 * Add your custom tools to this array to make them available in the application
 */
export const tools: Tool[] = [
  {
    id: "subnet-calculator",
    name: "Subnet Calculator",
    description: "Calculate and validate network subnets",
    category: "Network",
    component: SubnetCalculator,
  },
  {
    id: "diff-tool",
    name: "Diff Comparison",
    description: "Compare text differences side by side",
    category: "Development",
    component: DiffTool,
  },
  {
    id: "json-xml-validator",
    name: "JSON/XML Validator",
    description: "Validate and format JSON/XML",
    category: "Data Processing",
    component: JsonXmlValidator,
  },
  {
    id: "api-tester",
    name: "API Tester",
    description: "Test HTTP/REST APIs",
    category: "Network",
    component: ApiTester,
    internalOnly: true,
  },
  {
    id: "port-checker",
    name: "Port Checker",
    description: "Check open ports on a host",
    category: "Network",
    component: PortChecker,
    internalOnly: true,
  },
  {
    id: "ip-lookup",
    name: "IP Address Lookup",
    description: "Get information about an IP address",
    category: "Network",
    component: IpLookup,
    internalOnly: true,
  },
  {
    id: "whois-checker",
    name: "WHOIS Checker",
    description: "Lookup domain registration information",
    category: "Network",
    component: WhoisChecker,
  },
  {
    id: "data-converter",
    name: "Data Converter",
    description: "Convert between JSON, CSV, XML formats",
    category: "Data Processing",
    component: DataConverter,
  },
  {
    id: "encryption-tool",
    name: "Encryption Tool",
    description: "Encrypt/decrypt data with AES",
    category: "Security",
    component: EncryptionTool,
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert images between formats",
    category: "Image",
    component: ImageConverter,
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Compress images to reduce file size",
    category: "Image",
    component: ImageCompressor,
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to specific dimensions",
    category: "Image",
    component: ImageResizer,
  },
  {
    id: "metadata-cleaner",
    name: "Metadata Cleaner",
    description: "Remove metadata from files",
    category: "Security",
    component: MetadataCleaner,
  },
  {
    id: "base64-tool",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    category: "Encoding",
    component: Base64Tool,
  },
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URLs",
    category: "Encoding",
    component: UrlEncoder,
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA hashes",
    category: "Security",
    component: HashGenerator,
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions",
    category: "Development",
    component: RegexTester,
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between timestamp formats",
    category: "Development",
    component: TimestampConverter,
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes from text",
    category: "Encoding",
    component: QrGenerator,
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JWT tokens",
    category: "Security",
    component: JwtDecoder,
  },
];

/**
 * Get all tools, optionally filtering out internal-only tools in public mode
 */
export function getAvailableTools(): Tool[] {
  if (isPublicMode()) {
    return tools.filter((tool) => !tool.internalOnly);
  }
  return tools;
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

/**
 * Check if a tool is accessible in the current site mode
 */
export function isToolAccessible(tool: Tool): boolean {
  if (tool.internalOnly && isPublicMode()) {
    return false;
  }
  return true;
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(tools.map((tool) => tool.category)));
}
