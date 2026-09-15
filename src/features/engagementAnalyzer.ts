import { callClaude } from '../utils/claudeClient';
import { EngagementMetrics, AnalysisResult } from '../types';

const systemPrompt = `You are a LinkedIn analytics expert.
You analyze engagement metrics and provide:
- Performance insights
- Trend analysis
- Optimization recommendations
- Benchmarking against industry standards
- Growth strategies`;

export async function analyzeEngagement(
  metrics: EngagementMetrics,
  industry: string,
  jobTitle: string
): Promise<AnalysisResult> {
  const messages = [
    {
      role: 'user' as const,
      content: `Analyze these LinkedIn engagement metrics for a ${industry} professional with title "${jobTitle}":

Metrics:
- Profile Views (this month): ${metrics.profileViews}
- Post Impressions (this month): ${metrics.postImpressions}
- Engagement Rate: ${metrics.engagementRate}%
- Total Connections: ${metrics.connections}
- Follower Growth Rate: ${metrics.followerGrowthRate}% (monthly)

Provide:
1. Performance assessment (good/needs improvement/excellent)
2. Comparison to industry benchmarks
3. Top 5 specific recommendations to improve engagement
4. Content strategies that would work best
5. Timeline for expected improvements

Be specific and actionable.`,
    },
  ];

  const analysis = await callClaude(messages, systemPrompt);

  return {
    timestamp: new Date().toISOString(),
    analysis: analysis,
    suggestions: extractSuggestions(analysis),
  };
}

export async function getEngagementTrends(
  historicalMetrics: EngagementMetrics[],
  timeframe: string = 'last 3 months'
): Promise<string> {
  const metricsJson = JSON.stringify(historicalMetrics, null, 2);

  const messages = [
    {
      role: 'user' as const,
      content: `Analyze these LinkedIn engagement trends over ${timeframe}:

${metricsJson}

Provide:
1. Key trends you observe
2. Growth or decline patterns
3. Correlation between activities (if any)
4. Predictive insights for next period
5. Specific actions to reverse negative trends or accelerate positive ones`,
    },
  ];

  return await callClaude(messages, systemPrompt);
}

export async function contentPerformanceAnalysis(
  posts: Array<{
    content: string;
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  }>,
  topic: string
): Promise<string> {
  const postsJson = JSON.stringify(posts, null, 2);

  const messages = [
    {
      role: 'user' as const,
      content: `Analyze the performance of these ${topic}-related LinkedIn posts:

${postsJson}

Provide:
1. Best performing content and why
2. Patterns in high-engagement posts
3. Content improvements for future posts
4. Optimal posting frequency
5. Content mix recommendations`,
    },
  ];

  return await callClaude(messages, systemPrompt);
}

export async function getEngagementScore(metrics: EngagementMetrics): Promise<number> {
  const baseScore = Math.min(100, metrics.engagementRate * 10);
  const connectionBonus = Math.min(20, metrics.connections / 100);
  const viewBonus = Math.min(15, metrics.profileViews / 50);
  const growthBonus = Math.min(15, metrics.followerGrowthRate * 5);

  return Math.round(baseScore + connectionBonus + viewBonus + growthBonus);
}

function extractSuggestions(analysis: string): string[] {
  const suggestions: string[] = [];
  const lines = analysis.split('\n');

  for (const line of lines) {
    if (line.match(/^\d+\.|^[-•]/)) {
      suggestions.push(line.replace(/^\d+\.\s+|^[-•\s]+/, '').trim());
    }
  }

  return suggestions.slice(0, 10);
}

// Example usage
if (require.main === module) {
  const exampleMetrics: EngagementMetrics = {
    profileViews: 245,
    postImpressions: 3500,
    engagementRate: 4.2,
    connections: 1250,
    followerGrowthRate: 2.5,
  };

  analyzeEngagement(exampleMetrics, 'Technology', 'Senior Software Engineer')
    .then((result) => {
      console.log('Engagement Analysis:');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => console.error('Error:', error));
}
