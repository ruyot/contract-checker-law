import mammoth from 'mammoth';

// Use dynamic import for pdf-parse since it's a CommonJS module
async function parsePdf(buffer: Buffer): Promise<string> {
  const pdfParse = await import('pdf-parse');
  const data = await (pdfParse as any)(buffer);
  return data.text;
}

export async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  try {
    switch (fileExtension) {
      case 'pdf':
        return await parsePdf(buffer);

      case 'docx':
        const docxResult = await mammoth.extractRawText({ buffer });
        return docxResult.value;

      case 'txt':
        return buffer.toString('utf-8');

      case 'doc':
        // For older .doc files, try to read as text
        return buffer.toString('utf-8');

      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

