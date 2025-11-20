# Contract Checker

A modern web application that uses AI to analyze legal contracts and provide clear, actionable insights. Upload any contract and get instant analysis of key terms, risks, obligations, and important dates.

## Features

- **Multiple File Formats**: Support for PDF, DOC, DOCX, and TXT files
- **AI-Powered Analysis**: Uses Google's Gemini API for intelligent contract analysis
- **Key Insights**: Automatically identifies financial terms, obligations, risks, and deadlines
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Fast Processing**: Get analysis results in seconds

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- A Gemini API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd contract-checker
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up your Groq API key:
   - Get your free API key from [Groq Console](https://console.groq.com/keys)
   - Free tier: 14,400 requests/day (no credit card required!)
   - Add to `.env.local`:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload**: Drag and drop or select a contract file (PDF, DOC, DOCX, or TXT)
2. **Analyze**: Click "Analyze Contract" to send it to the Gemini API
3. **Review**: Get a comprehensive breakdown of:
   - Executive summary
   - Financial terms and costs
   - Your obligations and responsibilities
   - Risks and penalties
   - Important dates and deadlines

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS, Radix UI
- **AI**: Groq (Llama 3.3 70B Versatile)
- **File Parsing**: pdf-parse, mammoth
- **TypeScript**: Full type safety

## API Endpoints

### POST /api/analyze

Analyzes a contract file and returns structured insights.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Response:**
```json
{
  "fileName": "contract.pdf",
  "analysisTime": "2.3 seconds",
  "summary": "Brief executive summary...",
  "keyPoints": [
    {
      "category": "Financial",
      "items": ["list of financial terms"],
      "severity": "neutral"
    }
  ]
}
```

## Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## File Size Limits

- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX, TXT

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com | Yes |

**Free Tier:** 14,400 requests/day - Perfect for demos and testing!

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

