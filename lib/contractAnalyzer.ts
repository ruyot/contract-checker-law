import Groq from 'groq-sdk';

export interface ContractAnalysis {
  fileName: string;
  analysisTime: string;
  summary: string;
  keyPoints: {
    category: string;
    items: string[];
    severity: 'neutral' | 'warning' | 'success';
  }[];
}

export async function analyzeContract(
  contractText: string,
  fileName: string,
  apiKey: string
): Promise<ContractAnalysis> {
  const startTime = Date.now();

  if (!apiKey) {
    throw new Error('Groq API key is not configured');
  }

  const groq = new Groq({ apiKey });

  const prompt = `You are a legal contract analyzer. Analyze the following contract and provide a comprehensive breakdown in JSON format.

Contract Text:
${contractText}

Please analyze this contract and provide a response in the following JSON structure:
{
  "summary": "A brief 1-2 sentence executive summary of the contract",
  "keyPoints": [
    {
      "category": "Financial",
      "items": ["list of financial terms, costs, payment schedules, fees, etc."],
      "severity": "neutral|warning|success"
    },
    {
      "category": "Obligations",
      "items": ["list of obligations and responsibilities for all parties"],
      "severity": "neutral|warning|success"
    },
    {
      "category": "Risks & Penalties",
      "items": ["list of risks, penalties, liability clauses, termination fees"],
      "severity": "warning"
    },
    {
      "category": "Important Dates",
      "items": ["list of deadlines, renewal dates, notice periods, etc."],
      "severity": "neutral"
    }
  ]
}

Guidelines:
- Be specific and extract actual values, dates, and amounts from the contract
- Use "warning" severity for risks, penalties, or unfavorable terms
- Use "success" severity for particularly favorable or protective terms
- Use "neutral" severity for standard terms
- Keep items concise but informative
- If a category doesn't apply, include it with an empty items array

Return ONLY valid JSON, no additional text or formatting.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile', // Fast and accurate, great free tier limits
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Clean up the response to extract JSON
    let jsonText = responseText.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse the JSON response
    const analysis = JSON.parse(jsonText);

    const endTime = Date.now();
    const analysisTime = ((endTime - startTime) / 1000).toFixed(1);

    return {
      fileName,
      analysisTime: `${analysisTime} seconds`,
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
    };
  } catch (error) {
    console.error('Error analyzing contract with Groq:', error);
    throw new Error(`Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
