import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DEFAULT_BUSINESS_RULES } from '@/lib/business-rules';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key-for-build',
});

const AI_PROMPT_TEMPLATE = `You are ProjectTimelineAI, an expert construction estimator. Analyse the uploaded architectural drawing or floor plan with precision.

STEP 1: DETAILED EXTRACTION
Extract and measure:
- Total square footage/meterage (estimate from scale if shown, or from typical room dimensions)
- Exact room count and types (kitchen, bathroom, bedroom, living, etc.)
- Number of floors/stories
- Ceiling heights (standard 2.4m/8ft unless noted)
- Structural complexity: load-bearing walls, extensions, conversions, loft work
- Existing condition: new build, renovation, or refurbishment
- Special features: ensuites, utilities, built-ins, fireplaces
- Access challenges: narrow stairs, limited parking, upper floors

STEP 2: SIZE CLASSIFICATION
Classify the project:
- SMALL: 1-2 rooms, <50m² (studio, small flat) → Use LOWER 25% of duration ranges
- MEDIUM: 3-4 rooms, 50-90m² (2-3 bed flat/house) → Use MIDDLE 50% of duration ranges
- LARGE: 5-6 rooms, 90-150m² (3-4 bed house) → Use UPPER 50% of duration ranges
- VERY LARGE: 7+ rooms, >150m² (large house, multiple floors) → Use UPPER 75% of duration ranges and add 20-30%

STEP 3: APPLY BUSINESS RULES
Use these baseline durations, then SCALE based on size classification above:

{{business_rules}}

STEP 4: CALCULATE SPECIFIC DURATIONS
- DO NOT just return the full range (e.g., "2-5 days")
- Pick SPECIFIC values within the range based on the size classification
- For SMALL projects: demolition should be 2-3 days, NOT 2-5 days
- For MEDIUM projects: narrow the range by 50% (e.g., 3-4 days instead of 2-5)
- For LARGE projects: use upper ranges with tighter estimates
- Add specifics to descriptions: "Demolition of 4-room single floor flat (approx 65m²)"

STEP 5: DETAILED PROJECT SUMMARY
Include:
- Property type and size estimate in m² or sq ft
- Number and types of rooms
- Floor count
- Renovation scope (full refurb, light renovation, new build)
- Key complexities noted

STEP 6: REALISTIC ASSUMPTIONS & RISKS
Assumptions should be specific:
- "Estimated at 65m² based on typical 2-bed flat dimensions"
- "Standard ceiling heights of 2.4m assumed"
- "Single tradespeople team assumed (adjust if multiple crews available)"

Risk factors should be project-specific:
- NOT "Weather conditions" for indoor refurbs
- NOT "Material delays" unless large project
- INSTEAD: "Access limited to stairwell only" or "Structural survey may reveal hidden issues"

OUTPUT FORMAT:
{
  "project_summary": "Detailed 2-3 sentence description with size, scope, and type",
  "phases": [
    {
      "name": "Demolition",
      "description": "Specific scope - what exactly is being demolished in this project",
      "duration_days_min": X,
      "duration_days_max": Y
    }
  ],
  "total_duration_days_min": sum_of_minimums,
  "total_duration_days_max": sum_of_maximums,
  "assumptions": ["Specific", "measurable", "assumptions"],
  "risk_factors": ["Project-specific", "relevant", "risks"]
}

CRITICAL RULES:
- Return NARROW, SPECIFIC duration ranges (typically 1-3 day spread, not 2-5 day spread)
- Base estimates on ACTUAL project size, not generic templates
- Include size estimates (m² or sq ft) in project summary
- Make descriptions project-specific, not generic
- Only include relevant risks (no generic "weather" or "material delays" unless truly applicable)
- Return ONLY valid JSON, no markdown formatting or additional text`;

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
      max_tokens: 3000,
      temperature: 0.5, // Balanced temperature for specific yet consistent outputs
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
