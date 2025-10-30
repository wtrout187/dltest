// Progress Tracking and Analytics
class ProgressTracker {
  constructor() {
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    console.log('📊 Initializing progress tracker...');

    // Listen to state changes
    if (window.State) {
      window.State.on('question:answered', (data) => this.updateProgress(data));
      windoon('session:ended', (data) => this.updateSessionStats(data));
    }

    this.isInitialized = true;
    console.log('✅ Progress tracker initialized');
  }

  updateProgress(data) {
    // Update category-specific progress
    this.updateCategoryProgress(data.category, data.correct);

    // Update weak areas
    this.updateWeakAreas(data.category, data.correct);

    // Update readiness score
    this.updateReadinessScore();

    // Update UI
    this.updateProgressUI();
  }

  updateCategoryProgress(category, correct) {
    if (!window.State) return;

    const progress = window.State.getProgress();

    if (!progress.categories[category]) {
      progress.categories[category] = {
        total: 0,
        correct: 0,
        accuracy: 0,
        lastStudied: null,
        streak: 0,
        bestStreak: 0
      };
    }

    const categoryData = progress.categories[category];
    categoryData.total++;
    categoryData.lastStudied = new Date().toISOString();

    if (correct) {
      categoryData.correct++;
      categoryData.streak++;
      categoryData.bestStreak = Math.max(categoryData.bestStreak, categoryData.streak);
    } else {
      categoryData.streak = 0;
    }

    categoryData.accuracy = Math.round((categoryData.correct / categoryData.total) * 100);

    window.State.setProgress(progress);
  }

  updateWeakAreas(category, correct) {
    if (!window.State) return;

    const progress = window.State.getProgress();
    const categoryData = progress.categories[category];

    if (!categoryData) return;

    // Add to weak areas if accuracy drops below 70% (with minimum 5 questions)
    if (categoryData.total >= 5 && categoryData.accuracy < 70) {
      if (!progress.weakAreas.includes(category)) {
        progress.weakAreas.push(category);
      }
    }

    // Remove from weak areas if accuracy improves to 80% or better
    if (categoryData.accuracy >= 80) {
      const index = progress.weakAreas.indexOf(category);
      if (index > -1) {
        progress.weakAreas.splice(index, 1);
      }

      // Add to mastered topics if accuracy is 90% or better with 10+ questions
      if (categoryData.accuracy >= 90 && categoryData.total >= 10) {
        if (!progress.masteredTopics.includes(category)) {
          progress.masteredTopics.push(category);
        }
      }
    }

    window.State.setProgress(progress);
  }

  updateReadinessScore() {
    if (!window.State) return;

    const userData = window.State.getUserData();
    const progress = window.State.getProgress();

    let score = 0;

    // Base score from overall accuracy (0-60 points)
    if (userData.totalQuestions > 0) {
      const overallAccuracy = (userData.correctAnswers / userData.totalQuestions) * 100;
      score += Math.min(60, overallAccuracy * 0.6);
    }

    // Category coverage bonus (0-20 points)
    const categories = Object.keys(progress.categories);
    const requiredCategories = [
      'traffic-signs', 'right-of-way', 'speed-limits', 'parking',
      'driving-laws', 'safe-driving', 'intersections'
    ];

    const coveredCategories = categories.filter(cat =>
      progress.categories[cat].total >= 3 && progress.categories[cat].accuracy >= 70
    );

    const coveragePercent = Math.min(100, (coveredCategories.length / requiredCategories.length) * 100);
    score += coveragePercent * 0.2;

    // Experience bonus (0-10 points)
    score += Math.min(10, userData.totalQuestions * 0.1);

    // Streak bonus (0-10 points)
    score += Math.min(10, userData.streak * 1.5);

    // Mastered topics bonus (0-5 points)
    score += Math.min(5, progress.masteredTopics.length);

    // Penalty for weak areas (-5 points per weak area)
    score -= progress.weakAreas.length * 5;

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    progress.readinessScore = score;
    window.State.setProgress(progress);

    // Update UI
    this.updateReadinessUI(score);
  }

  updateReadinessUI(score) {
    const readinessScore = document.getElementById('readinessScore');
    const readinessProgressBar = document.getElementById('readinessProgressBar');
    const readinessMessage = document.getElementById('readinessMessage');

    if (readinessScore) {
      readinessScore.textContent = `${score}/100`;
    }

    if (readinessProgressBar) {
      readinessProgressBar.style.width = `${score}%`;
    }

    if (readinessMessage) {
      let message = '🚀 Start practicing!';

      if (score >= 85) {
        message = '🎉 Ready to take the test!';
      } else if (score >= 70) {
        message = '🚀 Almost ready! Keep practicing!';
      } else if (score >= 50) {
        message = '📚 Good progress! Focus on weak areas!';
      } else if (score >= 30) {
        message = '💪 You\'re getting there! Keep studying!';
      } else if (score >= 10) {
        message = '📖 Keep practicing to improve!';
      }

      readinessMessage.textContent = message;
    }
  }

  updateSessionStats(sessionData) {
    if (!sessionData || !window.Storage) return;

    // Add session to history
    const sessionRecord = {
      date: new Date().toISOString(),
      mode: sessionData.mode,
      totalQuestions: sessionData.totalQuestions,
      correctAnswers: sessionData.correctAnswers,
      accuracy: sessionData.totalQuestions > 0 ?
        Math.round((sessionData.correctAnswers / sessionData.totalQuestions) * 100) : 0,
      duration: sessionData.startTime ?
        Math.round((new Date() - new Date(sessionData.startTime)) / 1000) : 0
    };

    window.Storage.addToHistory(sessionRecord);
  }

  updateProgressUI() {
    // Update overall stats
    const userData = window.State?.getUserData();
    if (!userData) return;

    const totalQuestions = document.getElementById('totalQuestions');
    const overallAccuracy = document.getElementById('overallAccuracy');
    const currentStreak = document.getElementById('currentStreak');

    if (totalQuestions) {
      totalQuestions.textContent = userData.totalQuestions.toString();
    }

    if (overallAccuracy) {
      const accuracy = userData.totalQuestions > 0 ?
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0;
      overallAccuracy.textContent = `${accuracy}%`;
    }

    if (currentStreak) {
      currentStreak.textContent = `${userData.streak} days 🔥`;
    }
  }

  // Get detailed progress report
  getProgressReport() {
    const userData = window.State?.getUserData();
    const progress = window.State?.getProgress();

    if (!userData || !progress) return null;

    const overallAccuracy = userData.totalQuestions > 0 ?
      Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0;

    return {
      overall: {
        totalQuestions: userData.totalQuestions,
        correctAnswers: userData.correctAnswers,
        accuracy: overallAccuracy,
        level: userData.level,
        xp: userData.xp,
        streak: userData.streak,
        studySessions: userData.studySessions
      },
      readiness: {
        score: progress.readinessScore,
        message: this.getReadinessMessage(progress.readinessScore)
      },
      categories: progress.categories,
      weakAreas: progress.weakAreas,
      masteredTopics: progress.masteredTopics,
      achievements: {
        total: userData.achievements.length,
        recent: userData.achievements.slice(-5)
      }
    };
  }

  getReadinessMessage(score) {
    if (score >= 85) return 'Ready to take the test!';
    if (score >= 70) return 'Almost ready! Keep practicing!';
    if (score >= 50) return 'Good progress! Focus on weak areas!';
    if (score >= 30) return 'You\'re getting there! Keep studying!';
    if (score >= 10) return 'Keep practicing to improve!';
    return 'Start practicing!';
  }

  // Get study recommendations
  getStudyRecommendations() {
    const progress = window.State?.getProgress();
    if (!progress) return [];

    const recommendations = [];

    // Recommend weak areas
    if (progress.weakAreas.length > 0) {
      recommendations.push({
        type: 'weak-areas',
        title: 'Focus on Weak Areas',
        description: `You have ${progress.weakAreas.length} areas that need improvement`,
        categories: progress.weakAreas,
        priority: 'high'
      });
    }

    // Recommend categories with low question count
    const categories = Object.entries(progress.categories);
    const lowCountCategories = categories.filter(([cat, data]) => data.total < 10);

    if (lowCountCategories.length > 0) {
      recommendations.push({
        type: 'coverage',
        title: 'Expand Your Knowledge',
        description: 'Practice more questions in these categories',
        categories: lowCountCategories.map(([cat]) => cat),
        priority: 'medium'
      });
    }

    // Recommend review of mastered topics
    if (progress.masteredTopics.length > 0) {
      const oldMasteredTopics = progress.masteredTopics.filter(cat => {
        const categoryData = progress.categories[cat];
        if (!categoryData || !categoryData.lastStudied) return false;

        const daysSinceStudied = (new Date() - new Date(categoryData.lastStudied)) / (1000 * 60 * 60 * 24);
        return daysSinceStudied > 7; // Not studied in a week
      });

      if (oldMasteredTopics.length > 0) {
        recommendations.push({
          type: 'review',
          title: 'Review Mastered Topics',
          description: 'Keep your knowledge fresh with periodic review',
          categories: oldMasteredTopics,
          priority: 'low'
        });
      }
    }

    return recommendations;
  }

  // Get performance trends
  getPerformanceTrends() {
    // This would analyze historical data to show trends
    // For now, return basic trend information

    const userData = window.State?.getUserData();
    const progress = window.State?.getProgress();

    if (!userData || !progress) return null;

    const trends = {
      accuracy: {
        current: userData.totalQuestions > 0 ?
          Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0,
        trend: 'stable', // 'improving', 'declining', 'stable'
        change: 0
      },
      streak: {
        current: userData.streak,
        best: Math.max(userData.streak, 0),
        trend: userData.streak > 0 ? 'active' : 'broken'
      },
      activity: {
        sessionsThisWeek: userData.studySessions, // Simplified
        questionsThisWeek: userData.totalQuestions, // Simplified
        trend: 'stable'
      }
    };

    return trends;
  }

  // Export progress data
  async exportProgress() {
    const report = this.getProgressReport();
    const trends = this.getPerformanceTrends();
    const recommendations = this.getStudyRecommendations();

    const exportData = {
      timestamp: new Date().toISOString(),
      report,
      trends,
      recommendations,
      version: '1.0.0'
    };

    return exportData;
  }

  // Reset progress (for testing)
  resetProgress() {
    if (window.State) {
      window.State.resetProgress();
    }

    this.updateProgressUI();
    this.updateReadinessScore();
  }

  // Get category-specific insights
  getCategoryInsights(category) {
    const progress = window.State?.getProgress();
    if (!progress || !progress.categories[category]) return null;

    const categoryData = progress.categories[category];

    return {
      category,
      total: categoryData.total,
      correct: categoryData.correct,
      accuracy: categoryData.accuracy,
      streak: categoryData.streak,
      bestStreak: categoryData.bestStreak,
      lastStudied: categoryData.lastStudied,
      status: this.getCategoryStatus(categoryData),
      recommendation: this.getCategoryRecommendation(categoryData)
    };
  }

  getCategoryStatus(categoryData) {
    if (categoryData.total < 5) return 'needs-practice';
    if (categoryData.accuracy >= 90) return 'mastered';
    if (categoryData.accuracy >= 80) return 'good';
    if (categoryData.accuracy >= 70) return 'fair';
    return 'needs-improvement';
  }

  getCategoryRecommendation(categoryData) {
    const status = this.getCategoryStatus(categoryData);

    switch (status) {
      case 'needs-practice':
        return 'Practice more questions in this category to build confidence';
      case 'needs-improvement':
        return 'Focus on understanding the concepts better';
      case 'fair':
        return 'You\'re making progress! Keep practicing';
      case 'good':
        return 'Great work! Review occasionally to maintain proficiency';
      case 'mastered':
        return 'Excellent! Periodic review will keep this knowledge fresh';
      default:
        return 'Keep practicing to improve';
    }
  }
}

// Create global instance
window.Progress = new ProgressTracker();
