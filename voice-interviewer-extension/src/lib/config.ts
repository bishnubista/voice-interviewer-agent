/**
 * Application configuration utilities
 * Dynamically constructs URLs based on NODE_ENV
 */

/**
 * Get the interview app URL based on the current environment
 * - Development: http://localhost:3001 (voice-interviewer-extension dev server)
 * - Production: https://voice-interviewer-extension.vercel.app
 */
export function getInterviewUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }

  // Production URL
  return 'https://voice-interviewer-extension.vercel.app';
}

/**
 * Get the auth app URL based on the current environment
 * - Development: http://localhost:3000 (clerk-auth-extension dev server)
 * - Production: https://clerk-auth-extension.vercel.app
 */
export function getDashboardUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Production URL
  return 'https://clerk-auth-extension.vercel.app';
}
