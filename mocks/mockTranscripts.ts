// Mock Transcripts for Testing
// Sample interview responses with different emotional contexts

export interface MockTranscript {
  id: string;
  question: string;
  response: string;
  expectedEmotion: 'enthusiasm' | 'uncertainty' | 'frustration' | 'neutral';
  duration: number; // seconds
}

export const mockTranscripts: MockTranscript[] = [
  {
    id: '1',
    question: 'How do you feel about this product?',
    response: 'I absolutely love it! The design is so intuitive and it solves exactly the problem I was having. The user interface is beautiful and everything just works seamlessly.',
    expectedEmotion: 'enthusiasm',
    duration: 8.5,
  },
  {
    id: '2',
    question: 'Would you recommend this to a friend?',
    response: 'Um... I guess so? Maybe... I mean, it depends on what they need. I\'m not entirely sure if it would work for everyone.',
    expectedEmotion: 'uncertainty',
    duration: 6.2,
  },
  {
    id: '3',
    question: 'How was the onboarding experience?',
    response: 'Honestly, it was really frustrating. Why is it so complicated? I had to click through like ten screens just to get started. This is way too slow.',
    expectedEmotion: 'frustration',
    duration: 7.8,
  },
  {
    id: '4',
    question: 'What features do you use most?',
    response: 'I use the dashboard pretty regularly. It\'s fine. Nothing special, but it gets the job done.',
    expectedEmotion: 'neutral',
    duration: 5.1,
  },
  {
    id: '5',
    question: 'How does this compare to competitors?',
    response: 'Oh my god, it\'s SO much better! The competitors don\'t even come close. This is exactly what the market needed. I can\'t believe how much time it saves me!',
    expectedEmotion: 'enthusiasm',
    duration: 9.3,
  },
  {
    id: '6',
    question: 'Tell me about a recent problem you encountered.',
    response: 'Well... there was this thing last week... or maybe it was two weeks ago? I\'m not really sure what caused it. It might have been my internet, or maybe the app? I don\'t know.',
    expectedEmotion: 'uncertainty',
    duration: 7.5,
  },
  {
    id: '7',
    question: 'How would you improve the product?',
    response: 'Are you kidding me? Fix the performance issues first! It crashes constantly and the loading times are unacceptable. This should have been tested better before launch.',
    expectedEmotion: 'frustration',
    duration: 8.1,
  },
  {
    id: '8',
    question: 'How often do you use this product?',
    response: 'I use it daily for work. It\'s part of my routine now.',
    expectedEmotion: 'neutral',
    duration: 4.2,
  },
];

// Get transcript by emotion type
export function getTranscriptByEmotion(emotion: string): MockTranscript {
  return mockTranscripts.find(t => t.expectedEmotion === emotion) || mockTranscripts[0];
}

// Get random transcript
export function getRandomTranscript(): MockTranscript {
  return mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
}
