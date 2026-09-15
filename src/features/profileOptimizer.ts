import { callClaude } from '../utils/claudeClient';
import { LinkedInProfile, AnalysisResult } from '../types';

const systemPrompt = `You are an expert LinkedIn profile strategist with 10+ years of experience.
You specialize in:
- Profile optimization for maximum visibility
- Keyword research and SEO for LinkedIn
- Personal branding and positioning
- ATS (Applicant Tracking System) optimization
- Industry best practices

Provide specific, actionable recommendations with examples.`;

export async function optimizeProfile(profile: LinkedInProfile): Promise<AnalysisResult> {
  const profileJson = JSON.stringify(profile, null, 2);

  const messages = [
    {
      role: 'user' as const,
      content: `Please analyze and optimize my LinkedIn profile. Here's my current profile:

${profileJson}

Provide detailed recommendations for:
1. Headline optimization (make it compelling and keyword-rich)
2. Summary improvement (tell my story and highlight value)
3. Experience description enhancement
4. Skills section optimization
5. SEO keywords to add
6. Overall profile score and suggestions`,
    },
  ];

  const analysis = await callClaude(messages, systemPrompt);

  return {
    timestamp: new Date().toISOString(),
    analysis: analysis,
    suggestions: extractSuggestions(analysis),
    score: calculateScore(analysis),
  };
}

export async function optimizeHeadline(profile: LinkedInProfile): Promise<string[]> {
  const messages = [
    {
      role: 'user' as const,
      content: `Generate 5 compelling LinkedIn headlines for someone with this profile:
Name: ${profile.firstName} ${profile.lastName}
Current Headline: ${profile.headline}
Industry: ${profile.industry}
Experience: ${profile.experience.map((e) => e.title).join(', ')}
Skills: ${profile.skills.join(', ')}

Requirements:
- Each headline should be under 120 characters
- Include 2-3 relevant keywords
- Be compelling and unique
- Show value proposition

Provide ONLY the 5 headlines, one per line.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 500);
  return response.split('\n').filter((line) => line.trim().length > 0);
}

export async function optimizeSummary(profile: LinkedInProfile): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `Write a compelling LinkedIn summary for:
Name: ${profile.firstName} ${profile.lastName}
Headline: ${profile.headline}
Industry: ${profile.industry}
Experience: ${profile.experience.map((e) => `${e.title} at ${e.company}`).join('; ')}
Skills: ${profile.skills.join(', ')}

Requirements:
- 3-4 paragraphs
- Tell a compelling story
- Include keywords for searchability
- Show personality and values
- Include call-to-action
- Optimized for LinkedIn algorithm`,
    },
  ];

  return await callClaude(messages, systemPrompt, 1500);
}

function extractSuggestions(analysis: string): string[] {
  const suggestions: string[] = [];
  const lines = analysis.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
      suggestions.push(line.replace(/^[-•\s]+/, '').trim());
    }
  }

  return suggestions.slice(0, 10);
}

function calculateScore(analysis: string): number {
  const scoreMatch = analysis.match(/score|rating|out of|\d+\/100/i);
  if (scoreMatch) {
    const numbers = analysis.match(/\d+/g);
    if (numbers) {
      return Math.min(100, parseInt(numbers[0]));
    }
  }
  return 75;
}

// Example usage
if (require.main === module) {
  const exampleProfile: LinkedInProfile = {
    firstName: 'John',
    lastName: 'Developer',
    headline: 'Software Engineer | React Specialist',
    summary: 'Passionate about building scalable web applications',
    location: 'San Francisco, CA',
    industry: 'Technology',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        duration: '2021-Present',
        description: 'Leading frontend development team',
        skills: ['React', 'TypeScript', 'Leadership'],
      },
    ],
    education: [
      {
        school: 'University of Technology',
        degree: 'Bachelor',
        field: 'Computer Science',
        graduationYear: 2019,
      },
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    certifications: [],
    languages: ['English'],
  };

  optimizeProfile(exampleProfile)
    .then((result) => {
      console.log('Profile Optimization Result:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}
