import { callClaude } from '../utils/claudeClient';
import { LinkedInProfile, ConnectionStrategy } from '../types';

const systemPrompt = `You are a networking and relationship-building expert.
You specialize in:
- Building meaningful professional networks
- Connection strategies
- Outreach messaging
- Relationship nurturing
- Network leveraging for career growth
- Industry networking events

Provide genuine, authentic networking strategies.`;

export async function getConnectionStrategy(
  profile: LinkedInProfile,
  goals: string[]
): Promise<ConnectionStrategy> {
  const goalsText = goals.join(', ');

  const messages = [
    {
      role: 'user' as const,
      content: `Create a comprehensive networking strategy for:

Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Role: ${profile.headline}
- Industry: ${profile.industry}
- Location: ${profile.location}
- Current Connections: 500+ (example)

Goals: ${goalsText}

Provide:
1. Target audience definition
2. How to approach them authentically
3. 3 personalized connection message templates
4. Best practices for different connection types
5. Networking tips and etiquette
6. Follow-up strategy
7. How to provide value before asking for value

Focus on authentic, genuine relationships.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 1500);
  return parseConnectionStrategy(response);
}

export async function generateConnectionMessage(
  profile: LinkedInProfile,
  targetPerson: {
    name: string;
    title: string;
    company: string;
    commonConnection?: string;
  },
  purpose: 'networking' | 'collaboration' | 'mentorship' | 'learning'
): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `Generate a personalized LinkedIn connection message.

From:
- Name: ${profile.firstName} ${profile.lastName}
- Headline: ${profile.headline}

To:
- Name: ${targetPerson.name}
- Title: ${targetPerson.title}
- Company: ${targetPerson.company}
${targetPerson.commonConnection ? `- Common Connection: ${targetPerson.commonConnection}` : ''}

Purpose: ${purpose}

Requirements:
- Personal and authentic (not generic)
- 50-100 words
- Show you've researched them
- Clear reason for connecting
- Value proposition (what you can offer)
- Professional but warm tone

Write ONLY the message, no explanation.`,
    },
  ];

  return await callClaude(messages, systemPrompt, 400);
}

export async function getNetworkingTips(
  profile: LinkedInProfile,
  scenario: 'event' | 'online' | 'cold_outreach' | 'relationship_nurturing'
): Promise<string[]> {
  const scenarioDescriptions = {
    event: 'at in-person networking events and conferences',
    online: 'for online networking and LinkedIn interactions',
    cold_outreach: 'for reaching out to people you do not know',
    relationship_nurturing: 'for maintaining and deepening existing professional relationships',
  };

  const messages = [
    {
      role: 'user' as const,
      content: `Provide 10 practical networking tips for ${profile.firstName} who is in ${profile.industry} and wants to network ${scenarioDescriptions[scenario]}.

Current Network Size: ~500 connections
Goal: Expand network and build meaningful relationships

Provide:
- Specific, actionable tips
- Realistic and genuine approaches
- Include what to avoid
- Timeline suggestions if applicable

Format as numbered list.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 1000);
  return response.split('\n').filter((line) => line.trim().length > 0);
}

export async function identifyNetworkingOpportunities(
  profile: LinkedInProfile,
  targetIndustries: string[]
): Promise<string> {
  const industriesText = targetIndustries.join(', ');

  const messages = [
    {
      role: 'user' as const,
      content: `Identify networking opportunities for ${profile.firstName} in the ${industriesText} industries.

Profile:
- Current Role: ${profile.headline}
- Skills: ${profile.skills.join(', ')}
- Location: ${profile.location}
- Experience: ${profile.experience.map((e) => e.title).join(', ')}

Identify:
1. Key conferences and events to attend
2. Online communities and groups
3. Industry leaders to follow and engage with
4. Potential mentor relationships
5. Collaboration opportunities
6. Speaking opportunities
7. Panel participation opportunities
8. Timeline for each opportunity`,
    },
  ];

  return await callClaude(messages, systemPrompt, 1500);
}

export async function generateFollowUpSequence(
  profile: LinkedInProfile,
  recentConnectionName: string,
  conversationTopic: string
): Promise<string[]> {
  const messages = [
    {
      role: 'user' as const,
      content: `Create a 4-week follow-up sequence for maintaining relationship with ${recentConnectionName}.

Context:
- You (${profile.firstName}) recently connected
- Conversation topic: ${conversationTopic}
- Your role: ${profile.headline}

Provide 4 follow-up touchpoints (Week 1, 2, 3, 4) that:
- Provide value
- Show genuine interest
- Are not overly salesy
- Include specific conversation starters
- Lead to meaningful connection

Format each week as separate paragraph.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 1000);
  return response.split(/Week \d:/i).filter((section) => section.trim().length > 0);
}

function parseConnectionStrategy(response: string): ConnectionStrategy {
  return {
    targetAudience: extractSection(response, 'audience') || 'Relevant professionals in your industry',
    approachStrategy: extractSection(response, 'approach') || 'Authentic and personalized outreach',
    messageTemplates: extractTemplates(response),
    networkingTips: extractTips(response),
  };
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\s*([^\n]+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractTemplates(text: string): string[] {
  const templates: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.includes('message') || line.includes('template') || line.includes('Message')) {
      templates.push(line.trim());
    }
  }
  return templates.slice(0, 3);
}

function extractTips(text: string): string[] {
  const tips: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.match(/^\d+\.|^[-•]/)) {
      tips.push(line.replace(/^\d+\.\s+|^[-•\s]+/, '').trim());
    }
  }
  return tips.slice(0, 10);
}

// Example usage
if (require.main === module) {
  const exampleProfile: LinkedInProfile = {
    firstName: 'Sarah',
    lastName: 'Professional',
    headline: 'Marketing Manager | Brand Strategy',
    summary: 'Building strong brands',
    location: 'San Francisco, CA',
    industry: 'Marketing',
    experience: [
      {
        title: 'Marketing Manager',
        company: 'BrandCo',
        duration: '2021-Present',
        description: 'Managing brand strategy',
        skills: ['Marketing', 'Strategy'],
      },
    ],
    education: [
      {
        school: 'Marketing University',
        degree: 'Bachelors',
        field: 'Marketing',
        graduationYear: 2021,
      },
    ],
    skills: ['Marketing', 'Strategy', 'Brand', 'Analytics'],
    certifications: [],
    languages: ['English'],
  };

  getConnectionStrategy(exampleProfile, ['Expand network', 'Find mentors'])
    .then((strategy) => {
      console.log('Connection Strategy:');
      console.log(JSON.stringify(strategy, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}
