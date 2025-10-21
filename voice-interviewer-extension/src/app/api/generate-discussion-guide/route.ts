import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DiscussionGuide {
  title: string;
  sections: Array<{
    title: string;
    questions: string[];
  }>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brief } = body;

    if (!brief || typeof brief !== 'string' || brief.trim().length === 0) {
      return NextResponse.json(
        { error: 'Brief is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // If OpenAI not configured, return a fallback guide
    if (!process.env.OPENAI_API_KEY) {
      const fallbackGuide: DiscussionGuide = {
        title: 'Market Research Discussion Guide',
        sections: [
          {
            title: 'Introduction & Context',
            questions: [
              'Can you tell me a bit about yourself and your background?',
              'How familiar are you with this type of product/service?'
            ]
          },
          {
            title: 'Current Experience',
            questions: [
              'How do you currently handle this need?',
              'What tools or solutions do you use today?',
              'What works well with your current approach?'
            ]
          },
          {
            title: 'Pain Points & Challenges',
            questions: [
              'What challenges do you face with current solutions?',
              'What frustrates you most about existing options?',
              'What would make your life easier?'
            ]
          },
          {
            title: 'Preferences & Requirements',
            questions: [
              'What features are most important to you?',
              'What would an ideal solution look like?',
              'What would convince you to switch from your current solution?'
            ]
          },
          {
            title: 'Closing',
            questions: [
              'Is there anything else you\'d like to share?',
              'Do you have any questions for me?'
            ]
          }
        ]
      };

      return NextResponse.json({
        guide: fallbackGuide,
        reasoning: 'Using fallback guide (OpenAI not configured)'
      });
    }

    const systemPrompt = `You are an expert market researcher creating a discussion guide for a voice AI interviewer.

Based on the market research brief provided, create a structured discussion guide with 4-6 sections. Each section should have 2-4 questions that build naturally on each other.

The guide should:
1. Start with warm-up/introduction questions
2. Explore current behaviors and experiences
3. Identify pain points and challenges
4. Understand preferences and requirements
5. End with closing questions

Format your response as a JSON object with this exact structure:
{
  "title": "Brief descriptive title for the discussion guide",
  "sections": [
    {
      "title": "Section title",
      "questions": ["Question 1", "Question 2", "Question 3"]
    }
  ]
}

Make questions conversational and natural for a voice interview. Avoid yes/no questions. Focus on open-ended questions that encourage detailed responses.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Market Research Brief:\n\n${brief}` }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let guide: DiscussionGuide;
    try {
      guide = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', responseText);
      // Return fallback guide if JSON parsing fails
      const fallbackGuide: DiscussionGuide = {
        title: 'Market Research Discussion Guide',
        sections: [
          {
            title: 'Introduction',
            questions: [
              'Can you tell me about your experience with this topic?',
              'What brings you here today?'
            ]
          },
          {
            title: 'Current Situation',
            questions: [
              'How do you currently handle this?',
              'What challenges do you face?'
            ]
          },
          {
            title: 'Preferences',
            questions: [
              'What would you like to see improved?',
              'What would make this better for you?'
            ]
          }
        ]
      };
      
      return NextResponse.json({
        guide: fallbackGuide,
        reasoning: 'Used fallback guide due to JSON parsing error'
      });
    }

    // Validate the guide structure
    if (!guide.title || !guide.sections || !Array.isArray(guide.sections)) {
      throw new Error('Invalid guide structure received from OpenAI');
    }

    return NextResponse.json({
      guide,
      reasoning: 'Generated discussion guide from brief using OpenAI'
    });

  } catch (error) {
    console.error('Discussion guide generation error:', error);

    // Return fallback guide on any error
    const fallbackGuide: DiscussionGuide = {
      title: 'Market Research Discussion Guide',
      sections: [
        {
          title: 'Introduction',
          questions: [
            'Can you tell me about your experience with this topic?',
            'What brings you here today?'
          ]
        },
        {
          title: 'Current Situation',
          questions: [
            'How do you currently handle this?',
            'What challenges do you face?'
          ]
        },
        {
          title: 'Preferences',
          questions: [
            'What would you like to see improved?',
            'What would make this better for you?'
          ]
        }
      ]
    };

    return NextResponse.json({
      guide: fallbackGuide,
      reasoning: 'Used fallback guide due to error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
