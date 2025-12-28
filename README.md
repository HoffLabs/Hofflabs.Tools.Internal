# IT Multitool

A self-hosted collection of IT and developer tools built with Next.js and shadcn/ui. No accounts, no tracking, no data collection required.

## Features

- 🔒 **Privacy-First**: All processing happens in your browser or on your server
- 🚀 **Self-Hosted**: Deploy anywhere you want
- 🎨 **Modern UI**: Built with shadcn/ui components
- 🔌 **Modular**: Easy to add, remove, or customize tools
- 📱 **Responsive**: Works on desktop, tablet, and mobile

## Included Tools

### Network Tools
- Subnet Calculator/Validator
- Open Port Checker
- IP Address Lookup
- WHOIS Domain Checker
- API Tester (Postman-like)

### Data Processing
- JSON/XML Format Checker
- Data Converter (JSON to CSV, etc.)
- Diff Comparison Tool

### Encoding Tools
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- QR Code Generator

### Security Tools
- Encryption/Decryption Tool (AES)
- Hash Generator (MD5, SHA)
- JWT Decoder
- File Metadata Cleaner

### Image Tools
- Image Converter (PNG to JPG, ICO, etc.)
- Image Compressor
- Image Resizer

### Development Tools
- Regex Tester
- Timestamp Converter

## Quick Start

### Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tools-hofflabs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy Options

#### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

#### Docker
```bash
docker build -t it-multitool .
docker run -p 3000:3000 it-multitool
```

#### Traditional Server (with PM2)
```bash
npm install -g pm2
npm run build
pm2 start npm --name "it-multitool" -- start
```

#### Static Export (for static hosting)
```bash
# Add to next.config.js: output: 'export'
npm run build
# Deploy the 'out' directory to any static host
```

## Adding Custom Tools

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed instructions on how to add your own tools to the application.

Quick overview:
1. Create a new tool component in `tools/`
2. Register it in `lib/tool-registry.ts`
3. That's it!

## Project Structure

```
tools-hofflabs/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with header
│   ├── page.tsx           # Home page
│   ├── tools/             # Tools listing page
│   └── tool/[id]/         # Individual tool pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (header, etc.)
│   └── tool-card.tsx     # Tool card component
├── lib/                  # Utility libraries
│   ├── types/           # TypeScript type definitions
│   └── tool-registry.ts # Central tool registry
├── tools/               # Individual tool implementations
│   ├── base64-tool.tsx
│   ├── hash-generator.tsx
│   └── ...
└── public/             # Static assets
```

## Configuration

### Environment Variables

No environment variables are required for basic operation. All tools run client-side or use public APIs.

### Customization

- **Theme**: Edit `app/globals.css` to customize colors
- **Branding**: Update the header in `components/layout/header.tsx`
- **Tool Categories**: Modify categories in `lib/types/tool.ts`

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Security

- All sensitive operations (encryption, hashing) use the Web Crypto API
- No data is sent to external servers
- No cookies or tracking
- All processing happens client-side when possible

## License

MIT License - feel free to use this project however you'd like!

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for developers and IT professionals
