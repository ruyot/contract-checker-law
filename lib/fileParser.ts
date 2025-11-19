import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  try {
    switch (fileExtension) {
      case 'pdf':
        const pdfData = await pdfParse(buffer);
        return pdfData.text;

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

