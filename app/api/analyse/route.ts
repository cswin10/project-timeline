import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DEFAULT_BUSINESS_RULES } from '@/lib/business-rules';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key-for-build',
});

const AI_PROMPT_TEMPLATE = `You are ProjectTimelineAI. Analyse the uploaded architectural drawing or floor plan.

1. Extract all structural information:
- rooms
- dimensions
- floors
- key features
- structural elements
- complexity markers
- notes or symbols that affect build complexity

2. Apply the following business_rules when generating durations:

{{business_rules}}

3. Produce a structured project timeline ONLY in the following JSON:

{
  "project_summary": "",
  "phases": [
    {
      "name": "",
      "description": "",
      "duration_days_min": 0,
      "duration_days_max": 0
    }
  ],
  "total_duration_days_min": 0,
  "total_duration_days_max": 0,
  "assumptions": [],
  "risk_factors": []
}

Rules:
- ALWAYS return valid JSON.
- Never invent pricing.
- Keep descriptions short and practical.
- Respect dependency order between phases.
- If info is missing, make reasonable assumptions and state them clearly.
- Return ONLY the JSON object, no additional text or formatting.`;

function generatePrompt(businessRules = DEFAULT_BUSINESS_RULES): string {
  return AI_PROMPT_TEMPLATE.replace(
    '{{business_rules}}',
    JSON.stringify(businessRules, null, 2)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured at runtime
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key-for-build') {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { fileUrl, businessRules } = body;

    if (!fileUrl) {
      return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
    }

    // Generate the prompt with business rules
    const prompt = generatePrompt(businessRules);

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Using GPT-4 with vision capabilities
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'image_url',
              image_url: {
                url: fileUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent outputs
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let timeline;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = assistantMessage
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      timeline = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', assistantMessage);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    if (
      !timeline.project_summary ||
      !Array.isArray(timeline.phases) ||
      !timeline.total_duration_days_min ||
      !timeline.total_duration_days_max
    ) {
      throw new Error('Invalid timeline structure');
    }

    return NextResponse.json({ timeline }, { status: 200 });
  } catch (error) {
    console.error('Error in analyse API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An error occurred during analysis',
      },
      { status: 500 }
    );
  }
}
