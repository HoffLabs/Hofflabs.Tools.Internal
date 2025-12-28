# Quick Start Guide

## For Fedora Linux Users

The easiest way to get started is to use the setup script:

```bash
./setup-fedora.sh
```

This interactive script will:
- Check and install Node.js if needed
- Install dependencies
- Let you choose to run dev server, build for production, or setup Docker

## Manual Setup

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:3000
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker

```bash
# Using Docker
docker build -t it-multitool .
docker run -p 3000:3000 it-multitool

# Using Docker Compose
docker-compose up -d
```

## Adding Your First Tool

1. Create a new file in `tools/` directory:

```tsx
// tools/my-tool.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyTool() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tool</CardTitle>
        <CardDescription>Description of what it does</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Your tool UI here */}
      </CardContent>
    </Card>
  );
}
```

2. Register it in `lib/tool-registry.ts`:

```tsx
import MyTool from "@/tools/my-tool";

export const tools: Tool[] = [
  // ... existing tools
  {
    id: "my-tool",
    name: "My Tool",
    description: "Description",
    category: "Development",
    component: MyTool,
  },
];
```

3. Done! Your tool is now available at `/tool/my-tool`

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run lint         # Run linter

# Production
npm run build        # Build for production
npm start           # Start production server

# Docker
docker-compose up -d           # Start with Docker Compose
docker-compose down            # Stop containers
docker-compose logs -f         # View logs
```

## Troubleshooting

### Port 3000 already in use

```bash
# Find and kill the process using port 3000
sudo lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Docker issues on Fedora

```bash
# Start Docker service
sudo systemctl start docker

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in for changes to take effect
```

## Next Steps

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guide on creating tools
- Check out example tools in the `tools/` directory
- Customize the theme in `app/globals.css`
- Add more shadcn/ui components: `npx shadcn@latest add [component]`

## Need Help?

- Check the [README.md](./README.md) for full documentation
- Review existing tool implementations in `tools/`
- Open an issue on GitHub
