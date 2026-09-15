import dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiKey: process.env.ANTHROPIC_API_KEY || '',
  linkedinEmail: process.env.LINKEDIN_EMAIL || '',
  linkedinPassword: process.env.LINKEDIN_PASSWORD || '',
  linkedinAccessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 2048,
};

if (!config.apiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}
