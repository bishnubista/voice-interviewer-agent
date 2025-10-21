// Mock User Personas for Testing
// Different respondent types to test adaptive questioning

export interface MockPersona {
  id: string;
  name: string;
  role: string;
  emotionalProfile: {
    baseline: 'enthusiastic' | 'skeptical' | 'analytical' | 'impatient';
    volatility: 'stable' | 'variable' | 'erratic';
  };
  responsePatterns: {
    avgResponseLength: number; // words
    speakingPace: number; // words per minute
    pauseFrequency: 'low' | 'medium' | 'high';
    stockPhraseUsage: 'low' | 'medium' | 'high';
  };
  scenario: string;
  expectedAdaptations: string[];
}

export const mockPersonas: MockPersona[] = [
  {
    id: 'enthusiast-early-adopter',
    name: 'Sarah Chen',
    role: 'Early Adopter',
    emotionalProfile: {
      baseline: 'enthusiastic',
      volatility: 'stable',
    },
    responsePatterns: {
      avgResponseLength: 45,
      speakingPace: 155,
      pauseFrequency: 'low',
      stockPhraseUsage: 'low',
    },
    scenario: 'Product evangelist who loves new tech. Gives detailed, genuine feedback.',
    expectedAdaptations: [
      'AI should accelerate questioning',
      'Ask deeper technical questions',
      'Explore edge cases and advanced features',
    ],
  },

  {
    id: 'uncertain-novice',
    name: 'Michael Rodriguez',
    role: 'First-time User',
    emotionalProfile: {
      baseline: 'skeptical',
      volatility: 'variable',
    },
    responsePatterns: {
      avgResponseLength: 22,
      speakingPace: 95,
      pauseFrequency: 'high',
      stockPhraseUsage: 'high',
    },
    scenario: 'Not tech-savvy, uncertain about value. Uses phrases like "I guess", "maybe", "probably".',
    expectedAdaptations: [
      'AI should slow down questioning',
      'Simplify questions and provide examples',
      'Build confidence with encouraging follow-ups',
    ],
  },

  {
    id: 'frustrated-power-user',
    name: 'Jennifer Park',
    role: 'Power User',
    emotionalProfile: {
      baseline: 'impatient',
      volatility: 'erratic',
    },
    responsePatterns: {
      avgResponseLength: 35,
      speakingPace: 180,
      pauseFrequency: 'low',
      stockPhraseUsage: 'low',
    },
    scenario: 'Experienced user frustrated by limitations. Direct, sometimes cutting feedback.',
    expectedAdaptations: [
      'AI should acknowledge frustration',
      'Pivot to problem-solving questions',
      'Ask about specific pain points',
    ],
  },

  {
    id: 'analytical-researcher',
    name: 'David Thompson',
    role: 'UX Researcher',
    emotionalProfile: {
      baseline: 'analytical',
      volatility: 'stable',
    },
    responsePatterns: {
      avgResponseLength: 55,
      speakingPace: 125,
      pauseFrequency: 'medium',
      stockPhraseUsage: 'low',
    },
    scenario: 'Methodical thinker who provides balanced, nuanced feedback. Rarely emotional.',
    expectedAdaptations: [
      'AI should maintain neutral tone',
      'Ask comparative and contextual questions',
      'Explore reasoning behind opinions',
    ],
  },

  {
    id: 'disengaged-completer',
    name: 'Alex Kim',
    role: 'Survey Completer',
    emotionalProfile: {
      baseline: 'skeptical',
      volatility: 'stable',
    },
    responsePatterns: {
      avgResponseLength: 12,
      speakingPace: 110,
      pauseFrequency: 'medium',
      stockPhraseUsage: 'high',
    },
    scenario: 'Just completing interview for incentive. Short, generic responses. Low engagement.',
    expectedAdaptations: [
      'AI should try to increase engagement',
      'Ask more personal/relatable questions',
      'Detect low authenticity and adjust',
    ],
  },
];

// Get persona by baseline emotion
export function getPersonaByBaseline(baseline: string): MockPersona {
  return mockPersonas.find(p => p.emotionalProfile.baseline === baseline) || mockPersonas[0];
}

// Get random persona for testing
export function getRandomPersona(): MockPersona {
  return mockPersonas[Math.floor(Math.random() * mockPersonas.length)];
}

// Simulate persona response based on their profile
export function simulatePersonaResponse(persona: MockPersona, question: string): {
  text: string;
  emotion: string;
  engagement: number;
} {
  const responseMap: Record<string, any> = {
    'enthusiastic': {
      text: 'Oh absolutely! This is fantastic!',
      emotion: 'enthusiasm',
      engagement: 90,
    },
    'skeptical': {
      text: 'Um, I guess so... maybe.',
      emotion: 'uncertainty',
      engagement: 40,
    },
    'analytical': {
      text: 'From a usability perspective, it functions adequately.',
      emotion: 'neutral',
      engagement: 60,
    },
    'impatient': {
      text: 'This is taking forever. Can we speed this up?',
      emotion: 'frustration',
      engagement: 55,
    },
  };

  return responseMap[persona.emotionalProfile.baseline] || responseMap['analytical'];
}
