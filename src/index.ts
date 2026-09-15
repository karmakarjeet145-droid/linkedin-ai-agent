import * as profileOptimizer from './features/profileOptimizer';
import * as postGenerator from './features/postGenerator';
import * as engagementAnalyzer from './features/engagementAnalyzer';
import * as careerAdvisor from './features/careerAdvisor';
import * as connectionStrategy from './features/connectionStrategy';
import { LinkedInProfile } from './types';

// Example profile
const myProfile: LinkedInProfile = {
  firstName: 'John',
  lastName: 'Developer',
  headline: 'Software Engineer | React & Node.js Specialist',
  summary: 'Passionate about building scalable web applications and mentoring junior developers',
  location: 'San Francisco, CA',
  industry: 'Technology',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc',
      duration: '2021-Present',
      description: 'Leading frontend team, architecting React applications, mentoring 5 developers',
      skills: ['React', 'TypeScript', 'Leadership', 'Architecture'],
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      duration: '2019-2021',
      description: 'Built full stack applications with React and Node.js',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    },
    {
      title: 'Junior Developer',
      company: 'WebCo',
      duration: '2018-2019',
      description: 'Frontend development with React and Vue.js',
      skills: ['JavaScript', 'React', 'CSS'],
    },
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'Bachelor',
      field: 'Computer Science',
      graduationYear: 2018,
    },
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'MongoDB'],
  certifications: ['AWS Solutions Architect'],
  languages: ['English', 'Spanish'],
};

async function demonstrateAgent() {
  console.log('🚀 LinkedIn AI Agent Demo');
  console.log('=======================\n');

  try {
    // 1. Profile Optimization
    console.log('📋 1. PROFILE OPTIMIZATION');
    console.log('---------------------------');
    const profileAnalysis = await profileOptimizer.optimizeProfile(myProfile);
    console.log('Analysis:', profileAnalysis.analysis.substring(0, 500) + '...\n');

    // 2. Generate Headlines
    console.log('💡 2. HEADLINE SUGGESTIONS');
    console.log('--------------------------');
    const headlines = await profileOptimizer.optimizeHeadline(myProfile);
    headlines.forEach((h, i) => console.log(`${i + 1}. ${h}`));
    console.log();

    // 3. Post Generation
    console.log('📝 3. LINKEDIN POST GENERATION');
    console.log('------------------------------');
    const post = await postGenerator.generateLinkedInPost(
      myProfile,
      'The Future of Remote Work in Tech',
      'insight'
    );
    console.log('Post:', post.content.substring(0, 300) + '...');
    console.log('Hashtags:', post.hashtags.join(' '));
    console.log();

    // 4. Post Ideas
    console.log('💭 4. POST IDEAS');
    console.log('----------------');
    const ideas = await postGenerator.generatePostIdeas(myProfile, 5);
    ideas.forEach((idea) => console.log('• ' + idea));
    console.log();

    // 5. Career Recommendations
    console.log('🎯 5. CAREER RECOMMENDATIONS');
    console.log('-----------------------------');
    const careers = await careerAdvisor.getCareerRecommendations(
      myProfile,
      'Technical Leadership'
    );
    if (careers.length > 0) {
      console.log('Recommended Roles:', careers.map((c) => c.title).join(', '));
    } else {
      console.log('Career recommendations generated');
    }
    console.log();

    // 6. Connection Strategy
    console.log('🤝 6. NETWORKING STRATEGY');
    console.log('-------------------------');
    const strategy = await connectionStrategy.getConnectionStrategy(myProfile, [
      'Expand network',
      'Find mentorship opportunities',
      'Collaborate on open source',
    ]);
    console.log('Strategy generated successfully');
    console.log();

    // 7. Engagement Analysis
    console.log('📊 7. ENGAGEMENT ANALYSIS');
    console.log('-------------------------');
    const metrics = {
      profileViews: 245,
      postImpressions: 3500,
      engagementRate: 4.2,
      connections: 1250,
      followerGrowthRate: 2.5,
    };
    const analysis = await engagementAnalyzer.analyzeEngagement(
      metrics,
      myProfile.industry,
      myProfile.headline
    );
    console.log('Analysis:', analysis.analysis.substring(0, 300) + '...\n');

    console.log('✅ Demo completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the demo
demonstrateAgent();
