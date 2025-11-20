import { NextRequest, NextResponse } from 'next/server';
import { parseFile } from '@/lib/fileParser';
import { analyzeContract } from '@/lib/contractAnalyzer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed' },
        { status: 400 }
      );
    }

    // Get Groq API key from environment
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please set GROQ_API_KEY in your .env.local file.' },
        { status: 500 }
      );
    }

    // Parse the file
    console.log(`Parsing file: ${file.name}`);
    const contractText = await parseFile(file);

    if (!contractText || contractText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from the file' },
        { status: 400 }
      );
    }

    console.log(`Extracted ${contractText.length} characters from file`);

    // Analyze with Groq
    console.log('Analyzing contract with Groq...');
    const analysis = await analyzeContract(contractText, file.name, apiKey);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

