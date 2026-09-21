import { Achievement, AchievementScore, ResultsProfile, Tier, Recommendation } from '../types';

export function calculateAchievementScore(achievement: Achievement): AchievementScore {
  const rarityScore = -Math.log10(achievement.completionRate) * 25;
  
  const score = (rarityScore * 0.6) + 
                (achievement.difficulty * 4 * 0.25) + 
                (achievement.commitment * 3 * 0.15);

  return {
    ...achievement,
    rarityScore,
    score
  };
}

export function getTier(score: number): Tier {
  if (score >= 500) return 'Exceptional';
  if (score >= 350) return 'Remarkable';
  if (score >= 225) return 'Uncommon';
  if (score >= 125) return 'Notable';
  return 'Emerging';
}

export function calculateResults(selectedAchievements: Achievement[], allAchievements: Achievement[]): ResultsProfile {
  const scores = selectedAchievements.map(calculateAchievementScore);
  
  // Sort by score descending
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  // Calculate overall score with diminishing returns
  const overallScore = sortedScores.reduce((total, achievement, index) => {
    return total + (achievement.score * Math.pow(0.92, index));
  }, 0);

  const rarestAchievement = scores.reduce((prev, curr) => 
    (curr.rarityScore > prev.rarityScore) ? curr : prev, scores[0]);

  const hardestAchievement = scores.reduce((prev, curr) => 
    (curr.difficulty > prev.difficulty) ? curr : prev, scores[0]);

  // Category distribution
  const categoryDistribution: Record<string, number> = {
    'Running & Fitness': 0,
    'Outdoors & Adventure': 0,
    'Travel & Exploration': 0,
    'Skills & Learning': 0,
    'Life Experiences': 0
  };
  selectedAchievements.forEach(a => {
    categoryDistribution[a.category]++;
  });

  // Averages
  const averages = {
    difficulty: selectedAchievements.reduce((s, a) => s + a.difficulty, 0) / selectedAchievements.length,
    commitment: selectedAchievements.reduce((s, a) => s + a.commitment, 0) / selectedAchievements.length,
    adventure: selectedAchievements.reduce((s, a) => s + a.adventure, 0) / selectedAchievements.length,
  };

  // Summary generation
  let summary = "";
  const topCategory = Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1])[0][0];
  
  if (averages.adventure > 7) {
    summary = `You are a daring ${topCategory.toLowerCase().split(' & ')[0]} enthusiast who thrives on high-stakes exploration.`;
  } else if (averages.commitment > 7) {
    summary = `You possess an elite commitment profile, with patterns showing deep dedication to long-term masteries.`;
  } else if (averages.difficulty > 7) {
    summary = `You seek out the most demanding challenges, prioritizing sheer grit and technical difficulty.`;
  } else {
    summary = `You have a diverse achievement profile, balancing varied life experiences with consistent growth.`;
  }

  // Recommended next achievements
  const selectedIds = new Set(selectedAchievements.map(a => a.id));
  const recommendations: Recommendation[] = [];

  // 1. Path-based recommendations
  selectedAchievements.forEach(completed => {
    if (completed.pathId) {
      const nextInPath = allAchievements.find(a => 
        a.pathId === completed.pathId && 
        a.pathOrder === (completed.pathOrder || 0) + 1 &&
        !selectedIds.has(a.id)
      );
      
      if (nextInPath && !recommendations.find(r => r.id === nextInPath.id)) {
        recommendations.push({
          ...nextInPath,
          reason: `The natural next step after completing "${completed.name}".`
        });
      }
    }
  });

  // 2. Interest-based recommendations (if we need more)
  if (recommendations.length < 3) {
    const topCategory = Object.entries(categoryDistribution).sort((a, b) => b[1] - a[1])[0][0];
    const maxCompletedDifficulty = Math.max(...selectedAchievements.map(a => a.difficulty));
    
    const related = allAchievements
      .filter(a => 
        !selectedIds.has(a.id) && 
        !recommendations.find(r => r.id === a.id) &&
        (a.category === topCategory || a.difficulty >= maxCompletedDifficulty)
      )
      .sort((a, b) => {
        // Prefer slightly harder but not impossible
        const diffA = Math.abs(a.difficulty - (maxCompletedDifficulty + 1));
        const diffB = Math.abs(b.difficulty - (maxCompletedDifficulty + 1));
        return diffA - diffB;
      });

    related.forEach(a => {
      if (recommendations.length < 3) {
        recommendations.push({
          ...a,
          reason: a.category === topCategory 
            ? `Matches your strong interest in ${a.category}.` 
            : `A high-prestige challenge to push your current limits.`
        });
      }
    });
  }

  const finalRecommendations = recommendations.slice(0, 3);

  return {
    overallScore,
    tier: getTier(overallScore),
    totalSelected: selectedAchievements.length,
    rarestAchievement,
    hardestAchievement,
    topAchievements: sortedScores.slice(0, 5),
    recommendedNext: finalRecommendations,
    categoryDistribution: categoryDistribution as Record<any, number>,
    averages,
    summary
  };
}
