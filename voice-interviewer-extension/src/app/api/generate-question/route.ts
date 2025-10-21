import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConversationHistoryMessage {
  role: 'ai' | 'user';
  content: string;
  emotion?: string;
}

// Default questions for fallback
const fallbackQuestions = [
  "Tell me about your experience with this product.",
  "What features do you use most often?",
  "How does this compare to other solutions you've tried?",
  "What would make this better for you?",
  "Can you describe a recent situation where you used this?",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationHistory, currentEmotion, interviewTemplate, discussionGuide, currentSection } = body;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'conversationHistory is required and must be an array' },
        { status: 400 }
      );
    }

    // If OpenAI not configured, return fallback question
    if (!process.env.OPENAI_API_KEY) {
      const questionIndex = conversationHistory.length % fallbackQuestions.length;
      return NextResponse.json({
        question: fallbackQuestions[questionIndex],
        reasoning: 'Using default questions (OpenAI not configured)',
        adaptationStrategy: 'none',
      });
    }

    // Build system prompt based on emotion and template
    const emotionContext = currentEmotion ? `
Current emotional state: ${currentEmotion.emotion} (${Math.round(currentEmotion.engagement)}% engagement)

Adaptation guidelines:
- Enthusiasm: Ask deeper, more detailed questions. Explore edge cases.
- Uncertainty: Simplify questions. Provide examples. Be encouraging.
- Frustration: Acknowledge concerns. Pivot to solutions. Offer breaks.
- Neutral: Maintain balanced questioning pace.
` : '';

    // Use discussion guide if available, otherwise fall back to template
    let systemPrompt: string;
    
    if (discussionGuide && discussionGuide.sections) {
      const currentSectionIndex = currentSection || 0;
      const currentSectionData = discussionGuide.sections[currentSectionIndex];
      const allQuestions = discussionGuide.sections.flatMap(section => section.questions);
      
      systemPrompt = `You are an empathetic market research interviewer following this discussion guide:

TITLE: ${discussionGuide.title}

CURRENT SECTION: ${currentSectionData?.title || 'Introduction'}
Available questions for this section: ${currentSectionData?.questions?.join(', ') || 'General questions'}

All guide questions: ${allQuestions.join(', ')}

${emotionContext}

Generate ONE follow-up question that:
1. Follows the discussion guide structure and topics
2. Builds naturally on the conversation
3. Adapts to the respondent's emotional state
4. Seeks genuine insights, not stock answers
5. Is conversational, not robotic
6. Progresses through the guide sections appropriately

Keep questions under 20 words. Be human.`;
    } else {
      const templateContext = getTemplateContext(interviewTemplate);
      systemPrompt = `You are an empathetic market research interviewer conducting ${templateContext.name}.

${templateContext.focus}

${emotionContext}

Generate ONE follow-up question that:
1. Builds naturally on the conversation
2. Adapts to the respondent's emotional state
3. Seeks genuine insights, not stock answers
4. Is conversational, not robotic

Keep questions under 20 words. Be human.`;
    }

    // Generate adaptive question using GPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-5).map((msg: ConversationHistoryMessage) => ({
          role: (msg.role === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: msg.content,
        })),
        { role: 'user', content: 'Generate the next interview question based on the conversation and emotional context.' }
      ],
      max_tokens: 100,
      temperature: 0.8,
    });

    const question = completion.choices[0]?.message?.content?.trim() || fallbackQuestions[0];

    // Determine adaptation strategy based on emotion
    const adaptationStrategy = getAdaptationStrategy(currentEmotion?.emotion);

    return NextResponse.json({
      question,
      reasoning: `Adapted for ${currentEmotion?.emotion || 'neutral'} emotional state`,
      adaptationStrategy,
    });

  } catch (error) {
    console.error('Question generation error:', error);

    // Return fallback question on error
    const questionIndex = 0;
    return NextResponse.json({
      question: fallbackQuestions[questionIndex],
      reasoning: 'Fallback question due to error',
      adaptationStrategy: 'none',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

function getTemplateContext(template?: string) {
  const templates: Record<string, { name: string; focus: string }> = {
    product_feedback: {
      name: 'product feedback research',
      focus: 'Focus on usability, pain points, and feature satisfaction. Detect frustration early.',
    },
    brand_perception: {
      name: 'brand perception study',
      focus: 'Explore authentic feelings about the brand. Watch for stock phrases indicating rehearsed responses.',
    },
    ux_research: {
      name: 'UX research interview',
      focus: 'Understand user workflows and friction points. Track frustration indicators closely.',
    },
  };

  return templates[template || 'product_feedback'] || templates.product_feedback;
}

function getAdaptationStrategy(emotion?: string): string {
  const strategies: Record<string, string> = {
    enthusiasm: 'accelerate',
    uncertainty: 'simplify',
    frustration: 'pivot',
    neutral: 'deepen',
  };

  return strategies[emotion || 'neutral'] || 'deepen';
}
