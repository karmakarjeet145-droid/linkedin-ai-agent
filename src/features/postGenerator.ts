import { callClaude } from '../utils/claudeClient';
import { LinkedInPost, LinkedInProfile } from '../types';

const systemPrompt = `You are a LinkedIn content strategy expert.
You create posts that:
- Generate high engagement
- Follow LinkedIn best practices
- Build personal brand
- Provide value to audience
- Use optimal formatting
- Include relevant hashtags

Always consider the LinkedIn algorithm and what resonates with professionals.`;

export async function generateLinkedInPost(
  profile: LinkedInProfile,
  topic: string,
  contentType: 'insight' | 'story' | 'question' | 'tip' | 'announcement' = 'insight'
): Promise<LinkedInPost> {
  const messages = [
    {
      role: 'user' as const,
      content: `Generate a LinkedIn post for someone in the ${profile.industry} industry.
Profile: ${profile.firstName} ${profile.lastName}
Headline: ${profile.headline}
Topic: ${topic}
Content Type: ${contentType}

Requirements:
- 150-300 words
- Engaging opening hook
- Value-driven content
- Call-to-action (ask question or encourage shares)
- Format with line breaks for readability
- Include emoji strategically

Respond in JSON format:
{
  "content": "the post content",
  "hashtags": ["relevant", "hashtags"],
  "engagementTip": "why this post will engage your audience",
  "bestTimeToPost": "recommended posting time"
}`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 1500);
  return parsePostResponse(response);
}

export async function generatePostSeries(
  profile: LinkedInProfile,
  theme: string,
  numberOfPosts: number = 5
): Promise<LinkedInPost[]> {
  const messages = [
    {
      role: 'user' as const,
      content: `Create a series of ${numberOfPosts} LinkedIn posts about "${theme}" for a ${profile.industry} professional.

Theme: ${theme}
Posts should:
- Tell a cohesive story
- Vary in content type (story, insight, tip, question)
- Build on each other
- Be suitable for posting over 2 weeks

For each post, provide:
- Content (150-300 words)
- 3-5 relevant hashtags
- Engagement tip
- Recommended posting day

Respond as a JSON array of posts.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 3000);
  return parsePostSeriesResponse(response);
}

export async function generateEngagementResponse(
  originalPost: string,
  comment: string,
  profile: LinkedInProfile
): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `Generate a professional and engaging response to this comment on a LinkedIn post.

Original Post: ${originalPost}
Comment: ${comment}
Your Profile: ${profile.firstName} ${profile.lastName} - ${profile.headline}

Requirements:
- Professional yet personable tone
- Add value to the conversation
- Keep it concise (50-150 words)
- Include if appropriate: follow-up question, appreciation, or offer to help
- Genuine and authentic`,
    },
  ];

  return await callClaude(messages, systemPrompt, 500);
}

export async function generatePostIdeas(
  profile: LinkedInProfile,
  numberOfIdeas: number = 10
): Promise<string[]> {
  const messages = [
    {
      role: 'user' as const,
      content: `Generate ${numberOfIdeas} LinkedIn post ideas for a ${profile.industry} professional.

Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Headline: ${profile.headline}
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience.map((e) => e.title).join(', ')}

Ideas should:
- Be relevant to their expertise
- Generate engagement
- Provide value
- Be diverse in topic and format

Provide ONLY the ideas, one per line, numbered.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 1500);
  return response.split('\n').filter((line) => line.trim().length > 0);
}

function parsePostResponse(response: string): LinkedInPost {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing post response:', e);
  }

  return {
    content: response,
    hashtags: ['linkedin', 'networking'],
    engagementTip: 'Share your unique perspective',
    bestTimeToPost: 'Tuesday-Thursday 8-10 AM',
  };
}

function parsePostSeriesResponse(response: string): LinkedInPost[] {
  try {
    const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing post series response:', e);
  }

  return [];
}

// Example usage
if (require.main === module) {
  const exampleProfile: LinkedInProfile = {
    firstName: 'Jane',
    lastName: 'Tech',
    headline: 'Software Engineer | AI Enthusiast',
    summary: 'Building the future with AI',
    location: 'New York, NY',
    industry: 'Technology',
    experience: [
      {
        title: 'Senior ML Engineer',
        company: 'AI Startup',
        duration: '2022-Present',
        description: 'Building AI solutions',
        skills: ['Python', 'ML', 'AI'],
      },
    ],
    education: [
      {
        school: 'Tech University',
        degree: 'Masters',
        field: 'Machine Learning',
        graduationYear: 2022,
      },
    ],
    skills: ['Python', 'TensorFlow', 'AI', 'ML'],
    certifications: [],
    languages: ['English'],
  };

  generateLinkedInPost(exampleProfile, 'The Future of AI in Business', 'insight')
    .then((post) => {
      console.log('Generated LinkedIn Post:');
      console.log(JSON.stringify(post, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}
