# Contributing to IT Multitool

Thank you for your interest in contributing! This guide will help you add new tools to the application.

## Table of Contents

- [Adding a New Tool](#adding-a-new-tool)
- [Tool Structure](#tool-structure)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Testing Your Tool](#testing-your-tool)

## Adding a New Tool

Adding a new tool is a simple 3-step process:

### Step 1: Create Your Tool Component

Create a new file in the `tools/` directory with your tool's implementation.

**File naming convention**: Use kebab-case (e.g., `my-cool-tool.tsx`)

```tsx
// tools/my-cool-tool.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MyCoolTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleProcess = () => {
    // Your tool logic here
    setOutput(input.toUpperCase());
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>My Cool Tool</CardTitle>
          <CardDescription>A brief description of what your tool does</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Input</Label>
            <Input
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text here"
            />
          </div>
          
          <Button onClick={handleProcess}>Process</Button>
          
          <div className="space-y-2">
            <Label htmlFor="output">Output</Label>
            <Input
              id="output"
              value={output}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 2: Register Your Tool

Open `lib/tool-registry.ts` and:

1. Import your tool component at the top:
```tsx
import MyCoolTool from "@/tools/my-cool-tool";
```

2. Add your tool to the `tools` array:
```tsx
export const tools: Tool[] = [
  // ... existing tools ...
  {
    id: "my-cool-tool",           // Unique ID (use kebab-case)
    name: "My Cool Tool",         // Display name
    description: "Does cool stuff", // Short description
    category: "Development",      // Category (see available categories below)
    component: MyCoolTool,        // Your component
  },
];
```

### Step 3: Test Your Tool

That's it! Your tool is now available in the application. Test it by:

1. Running the dev server: `npm run dev`
2. Navigating to http://localhost:3000
3. Finding your tool in the appropriate category
4. Clicking on it to open the tool page

## Tool Structure

### Required Component Structure

Every tool must:
- Export a default React component
- Use the `"use client"` directive (for client-side interactivity)
- Be wrapped in a Card component from shadcn/ui
- Include a title and description in the CardHeader

### Available UI Components

You have access to all shadcn/ui components installed in the project:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
```

To add more components:
```bash
npx shadcn@latest add [component-name]
```

### Available Categories

Current categories:
- `"Network"`
- `"Data Processing"`
- `"Encoding"`
- `"Security"`
- `"Image"`
- `"Development"`

To add a new category, update `lib/types/tool.ts`:
```tsx
export type ToolCategory = 
  | "Network"
  | "Data Processing"
  | "Encoding"
  | "Security"
  | "Image"
  | "Development"
  | "Your New Category";  // Add here
```

## Best Practices

### 1. Keep It Client-Side

Process data client-side whenever possible:
- No user data leaves the browser
- Faster response times
- No server costs

### 2. Error Handling

Always handle errors gracefully:

```tsx
const handleProcess = () => {
  try {
    const result = someOperation(input);
    setOutput(result);
  } catch (error) {
    setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
```

### 3. Use Proper TypeScript Types

```tsx
import { ChangeEvent, FormEvent } from "react";

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setInput(e.target.value);
};
```

### 4. Provide Clear UI Feedback

- Show loading states for async operations
- Display error messages clearly
- Use placeholders to guide users
- Add tooltips for complex features

### 5. Make It Accessible

- Use semantic HTML
- Include proper labels for inputs
- Support keyboard navigation
- Provide appropriate ARIA attributes

### 6. Performance

- Debounce expensive operations
- Use `useMemo` for heavy computations
- Clean up event listeners and timers

```tsx
import { useMemo, useCallback } from "react";

const result = useMemo(() => {
  return expensiveCalculation(input);
}, [input]);
```

## Examples

### Example 1: Simple Text Transformer

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TextTransformer() {
  const [text, setText] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Transformer</CardTitle>
        <CardDescription>Transform text in various ways</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
        />
        <div className="flex gap-2">
          <Button onClick={() => setText(text.toUpperCase())}>
            Uppercase
          </Button>
          <Button onClick={() => setText(text.toLowerCase())}>
            Lowercase
          </Button>
          <Button onClick={() => setText(text.split("").reverse().join(""))}>
            Reverse
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Example 2: Tool with File Upload

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FileAnalyzer() {
  const [fileInfo, setFileInfo] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInfo(`
        Name: ${file.name}
        Size: ${(file.size / 1024).toFixed(2)} KB
        Type: ${file.type}
        Modified: ${new Date(file.lastModified).toLocaleString()}
      `);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Analyzer</CardTitle>
        <CardDescription>Get information about a file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">Select File</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
          />
        </div>
        {fileInfo && (
          <pre className="bg-muted p-4 rounded text-sm">
            {fileInfo}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
```

### Example 3: Tool with Tabs

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UnitConverter() {
  const [value, setValue] = useState<number>(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unit Converter</CardTitle>
        <CardDescription>Convert between different units</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="length">
          <TabsList>
            <TabsTrigger value="length">Length</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="temp">Temperature</TabsTrigger>
          </TabsList>
          
          <TabsContent value="length" className="space-y-4">
            <div className="space-y-2">
              <Label>Meters</Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Feet</Label>
              <Input
                type="number"
                value={(value * 3.28084).toFixed(2)}
                readOnly
              />
            </div>
          </TabsContent>
          
          {/* Add other tab contents */}
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

## Testing Your Tool

### Manual Testing Checklist

- [ ] Tool appears in the tools list
- [ ] Tool opens correctly from the tools list
- [ ] All inputs work as expected
- [ ] Outputs are correct
- [ ] Error cases are handled
- [ ] UI is responsive on mobile
- [ ] Back button works
- [ ] No console errors

### Build Testing

Before submitting, ensure the project builds:

```bash
npm run build
```

## Need Help?

- Check existing tools in the `tools/` directory for reference
- Review the [shadcn/ui documentation](https://ui.shadcn.com/)
- Open an issue if you're stuck

## Code Style

This project uses:
- ESLint for linting
- TypeScript for type safety
- Prettier for formatting (if configured)

Run the linter:
```bash
npm run lint
```

---

Happy coding! 🚀
