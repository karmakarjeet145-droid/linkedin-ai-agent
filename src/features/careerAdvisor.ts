import { callClaude } from '../utils/claudeClient';
import { LinkedInProfile, CareerRecommendation } from '../types';

const systemPrompt = `You are a senior career advisor with 20+ years of experience.
You specialize in:
- Career path planning
- Role transition strategies
- Skill gap analysis
- Industry trends and future-proofing
- Salary negotiation
- Job market analysis
- Professional development

Provide actionable, realistic career guidance.`;

export async function getCareerRecommendations(
  profile: LinkedInProfile,
  careerGoal?: string
): Promise<CareerRecommendation[]> {
  const messages = [
    {
      role: 'user' as const,
      content: `Based on this LinkedIn profile, suggest 5 career paths:

Profile:
- Name: ${profile.firstName} ${profile.lastName}
- Current Headline: ${profile.headline}
- Industry: ${profile.industry}
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience.map((e) => `${e.title} (${e.duration})`).join('; ')}
${careerGoal ? `- Career Goal: ${careerGoal}` : ''}

For each recommendation provide:
1. Job title
2. Why it's a good fit
3. Required skills (with gaps noted)
4. Top 3 companies hiring for this role
5. Realistic salary range

Respond as JSON array.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt, 2500);
  return parseCareerRecommendations(response);
}

export async function identifySkillGaps(
  profile: LinkedInProfile,
  targetRole: string
): Promise<{
  currentSkills: string[];
  requiredSkills: string[];
  skillGaps: string[];
  learningPath: string;
}> {
  const messages = [
    {
      role: 'user' as const,
      content: `Identify skill gaps for transitioning to "${targetRole}":

Current Profile:
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience.map((e) => e.title).join(', ')}
- Industry: ${profile.industry}

Provide:
1. List of current relevant skills
2. Required skills for target role
3. Skills to develop (with priority)
4. Recommended learning path with timeline
5. Resources to learn (courses, certifications)

Be specific and realistic about timeline.`,
    },
  ];

  const response = await callClaude(messages, systemPrompt);
  return parseSkillGapsResponse(response);
}

export async function getSalaryNegotiationTips(
  profile: LinkedInProfile,
  targetRole: string,
  location: string,
  currentSalary?: number
): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `Provide salary negotiation advice for:

Role: ${targetRole}
Location: ${location}
Industry: ${profile.industry}
Years of Experience: ${profile.experience.length}
Skills: ${profile.skills.join(', ')}
${currentSalary ? `Current Salary: $${currentSalary}` : ''}

Provide:
1. Market salary range
2. Your realistic asking salary
3. Negotiation strategy
4. Key points to emphasize
5. How to handle lowball offers
6. Non-salary benefits to negotiate
7. Red flags to watch for`,
    },
  ];

  return await callClaude(messages, systemPrompt, 1500);
}

export async function getJobSearchStrategy(
  profile: LinkedInProfile,
  targetRole: string,
  industryPreferences?: string[]
): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `Create a job search strategy for finding "${targetRole}" roles:

Profile:
- Current Role: ${profile.headline}
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experience.map((e) => e.title).join(', ')}
- Location: ${profile.location}
${industryPreferences ? `- Preferred Industries: ${industryPreferences.join(', ')}` : ''}

Provide a comprehensive strategy including:
1. Target companies (10+ specific companies)
2. Job search channels and tactics
3. LinkedIn optimization for this role
4. Portfolio/resume tips
5. Networking strategy
6. Interview preparation focus areas
7. Timeline and milestones
8. Contingency plans`,
    },
  ];

  return await callClaude(messages, systemPrompt, 2500);
}

export async function analyzeIndustryTrends(
  profile: LinkedInProfile,
  industry: string
): Promise<string> {
  const messages = [
    {
      role: 'user' as const,
      content: `Analyze current and future trends in the ${industry} industry for someone with this profile:

Current Skills: ${profile.skills.join(', ')}
Experience: ${profile.experience.map((e) => e.title).join(', ')}

Analyze:
1. Current market trends
2. Emerging technologies/skills
3. Role evolution in this industry
4. Future-proof skills to learn
5. Potential disruptions
6. Opportunity areas
7. Risk areas
8. 5-year outlook and recommendations`,
    },
  ];

  return await callClaude(messages, systemPrompt, 2000);
}

function parseCareerRecommendations(response: string): CareerRecommendation[] {
  try {
    const jsonMatch = response.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing career recommendations:', e);
  }
  return [];
}

function parseSkillGapsResponse(response: string) {
  return {
    currentSkills: [],
    requiredSkills: [],
    skillGaps: [],
    learningPath: response,
  };
}

// Example usage
if (require.main === module) {
  const exampleProfile: LinkedInProfile = {
    firstName: 'Alex',
    lastName: 'Engineer',
    headline: 'Frontend Developer | React Specialist',
    summary: 'Building great web experiences',
    location: 'New York, NY',
    industry: 'Technology',
    experience: [
      {
        title: 'Frontend Developer',
        company: 'TechCorp',
        duration: '2020-Present',
        description: 'Building with React',
        skills: ['React', 'JavaScript'],
      },
    ],
    education: [
      {
        school: 'Tech University',
        degree: 'Bachelors',
        field: 'Computer Science',
        graduationYear: 2020,
      },
    ],
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    certifications: [],
    languages: ['English'],
  };

  getCareerRecommendations(exampleProfile, 'Technical Leadership')
    .then((recommendations) => {
      console.log('Career Recommendations:');
      console.log(JSON.stringify(recommendations, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}
