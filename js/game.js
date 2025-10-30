// Gamification System - XP, Achievements, Streaks
class GameSystem {
  constructor() {
    this.achievements = this.getAchievementDefinitions();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    console.log('🎮 Initializing game system...');
   // Listen to state changes for achievement triggers
    if (window.State) {
      window.State.on('user:xp', (data) => this.checkXPAchievements(data));
      window.State.on('user:levelup', (data) => this.checkLevelAchievements(data));
      window.State.on('question:answered', (data) => this.checkQuestionAchievements(data));
      window.State.on('session:ended', (data) => this.checkSessionAchievements(data));
    }

    this.isInitialized = true;
    console.log('✅ Game system initialized');
  }

  getAchievementDefinitions() {
    return {
      // First steps
      'first-question': {
        id: 'first-question',
        name: 'First Steps',
        description: 'Answer your first question',
        icon: '🎯',
        xpReward: 25,
        condition: (data) => data.totalQuestions >= 1
      },

      'first-correct': {
        id: 'first-correct',
        name: 'Getting Started',
        description: 'Answer your first question correctly',
        icon: '✅',
        xpReward: 50,
        condition: (data) => data.correctAnswers >= 1
      },

      // Question milestones
      'questions-10': {
        id: 'questions-10',
        name: 'Dedicated Learner',
        description: 'Answer 10 questions',
        icon: '📚',
        xpReward: 100,
        condition: (data) => data.totalQuestions >= 10
      },

      'questions-25': {
        id: 'questions-25',
        name: 'Study Warrior',
        description: 'Answer 25 questions',
        icon: '⚔️',
        xpReward: 200,
        condition: (data) => data.totalQuestions >= 25
      },

      'questions-50': {
        id: 'questions-50',
        name: 'Knowledge Seeker',
        description: 'Answer 50 questions',
        icon: '🔍',
        xpReward: 300,
        condition: (data) => data.totalQuestions >= 50
      },

      'questions-100': {
        id: 'questions-100',
        name: 'Century Club',
        description: 'Answer 100 questions',
        icon: '💯',
        xpReward: 500,
        condition: (data) => data.totalQuestions >= 100
      },

      // Accuracy achievements
      'accuracy-80': {
        id: 'accuracy-80',
        name: 'Sharp Shooter',
        description: 'Maintain 80% accuracy (min 20 questions)',
        icon: '🎯',
        xpReward: 250,
        condition: (data) => data.totalQuestions >= 20 && data.accuracy >= 80
      },

      'accuracy-90': {
        id: 'accuracy-90',
        name: 'Precision Master',
        description: 'Maintain 90% accuracy (min 30 questions)',
        icon: '🏹',
        xpReward: 400,
        condition: (data) => data.totalQuestions >= 30 && data.accuracy >= 90
      },

      'perfect-session': {
        id: 'perfect-session',
        name: 'Flawless Victory',
        description: 'Get 100% in a 10+ question session',
        icon: '👑',
        xpReward: 300,
        condition: (data) => data.totalQuestions >= 10 && data.accuracy === 100
      },

      // Streak achievements
      'streak-3': {
        id: 'streak-3',
        name: 'On Fire',
        description: 'Study for 3 days in a row',
        icon: '🔥',
        xpReward: 150,
        condition: (data) => data.streak >= 3
      },

      'streak-7': {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Study for 7 days in a row',
        icon: '🗓️',
        xpReward: 350,
        condition: (data) => data.streak >= 7
      },

      'streak-14': {
        id: 'streak-14',
        name: 'Fortnight Fighter',
        description: 'Study for 14 days in a row',
        icon: '⚡',
        xpReward: 700,
        condition: (data) => data.streak >= 14
      },

      'streak-30': {
        id: 'streak-30',
        name: 'Monthly Master',
        description: 'Study for 30 days in a row',
        icon: '🏆',
        xpReward: 1500,
        condition: (data) => data.streak >= 30
      },

      // Level achievements
      'level-5': {
        id: 'level-5',
        name: 'Rising Star',
        description: 'Reach level 5',
        icon: '⭐',
        xpReward: 200,
        condition: (data) => data.level >= 5
      },

      'level-10': {
        id: 'level-10',
        name: 'Expert Driver',
        description: 'Reach level 10',
        icon: '🚗',
        xpReward: 500,
        condition: (data) => data.level >= 10
      },

      'level-15': {
        id: 'level-15',
        name: 'Road Master',
        description: 'Reach level 15',
        icon: '🛣️',
        xpReward: 1000,
        condition: (data) => data.level >= 15
      },

      // Special achievements
      'speed-demon': {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Answer 20 questions in under 5 minutes',
        icon: '💨',
        xpReward: 400,
        condition: (data) => data.totalQuestions >= 20 && data.timePerQuestion < 15
      },

      'night-owl': {
        id: 'night-owl',
        name: 'Night Owl',
        description: 'Study between 10 PM and 6 AM',
        icon: '🦉',
        xpReward: 150,
        condition: (data) => {
          const hour = new Date().getHours();
          return hour >= 22 || hour <= 6;
        }
      },

      'early-bird': {
        id: 'early-bird',
        name: 'Early Bird',
        description: 'Study between 5 AM and 8 AM',
        icon: '🐦',
        xpReward: 150,
        condition: (data) => {
          const hour = new Date().getHours();
          return hour >= 5 && hour <= 8;
        }
      },

      // Category mastery
      'signs-master': {
        id: 'signs-master',
        name: 'Sign Master',
        description: 'Get 90% accuracy on road signs (min 15 questions)',
        icon: '🚦',
        xpReward: 300,
        condition: (data) => this.checkCategoryMastery('traffic-signs', 90, 15)
      },

      'rules-expert': {
        id: 'rules-expert',
        name: 'Rules Expert',
        description: 'Get 85% accuracy on driving laws (min 20 questions)',
        icon: '📋',
        xpReward: 350,
        condition: (data) => this.checkCategoryMastery('driving-laws', 85, 20)
      }
    };
  }

  checkCategoryMastery(category, requiredAccuracy, minQuestions) {
    if (!window.State) return false;

    const progress = window.State.getProgress();
    const categoryData = progress.categories[category];

    if (!categoryData) return false;

    return categoryData.total >= minQuestions && categoryData.accuracy >= requiredAccuracy;
  }

  checkXPAchievements(data) {
    const userData = window.State?.getUserData();
    if (!userData) return;

    // Check all achievements that depend on XP or related stats
    Object.values(this.achievements).forEach(achievement => {
      if (!userData.achievements.includes(achievement.id)) {
        if (achievement.condition(userData)) {
          this.unlockAchievement(achievement.id);
        }
      }
    });
  }

  checkLevelAchievements(data) {
    const { newLevel } = data;

    // Check level-based achievements
    const levelAchievements = ['level-5', 'level-10', 'level-15'];
    levelAchievements.forEach(achievementId => {
      const achievement = this.achievements[achievementId];
      if (achievement && achievement.condition({ level: newLevel })) {
        this.unlockAchievement(achievementId);
      }
    });
  }

  checkQuestionAchievements(data) {
    // Check question and accuracy based achievements
    const questionAchievements = [
      'first-question', 'first-correct', 'questions-10', 'questions-25',
      'questions-50', 'questions-100', 'accuracy-80', 'accuracy-90'
    ];

    questionAchievements.forEach(achievementId => {
      const achievement = this.achievements[achievementId];
      if (achievement && achievement.condition(data)) {
        this.unlockAchievement(achievementId);
      }
    });

    // Check category mastery
    this.checkCategoryAchievements();
  }

  checkSessionAchievements(sessionData) {
    if (!sessionData || sessionData.totalQuestions === 0) return;

    const accuracy = Math.round((sessionData.correctAnswers / sessionData.totalQuestions) * 100);
    const sessionTime = sessionData.startTime ?
      (new Date() - new Date(sessionData.startTime)) / 1000 : 0;
    const timePerQuestion = sessionTime / sessionData.totalQuestions;

    // Check perfect session
    if (sessionData.totalQuestions >= 10 && accuracy === 100) {
      this.unlockAchievement('perfect-session');
    }

    // Check speed demon
    if (sessionData.totalQuestions >= 20 && timePerQuestion < 15) {
      this.unlockAchievement('speed-demon');
    }

    // Check time-based achievements
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      this.unlockAchievement('night-owl');
    } else if (hour >= 5 && hour <= 8) {
      this.unlockAchievement('early-bird');
    }

    // Check streak achievements
    const userData = window.State?.getUserData();
    if (userData) {
      const streakAchievements = ['streak-3', 'streak-7', 'streak-14', 'streak-30'];
      streakAchievements.forEach(achievementId => {
        const achievement = this.achievements[achievementId];
        if (achievement && achievement.condition(userData)) {
          this.unlockAchievement(achievementId);
        }
      });
    }
  }

  checkCategoryAchievements() {
    // Check category mastery achievements
    const categoryAchievements = ['signs-master', 'rules-expert'];

    categoryAchievements.forEach(achievementId => {
      const achievement = this.achievements[achievementId];
      if (achievement && achievement.condition({})) {
        this.unlockAchievement(achievementId);
      }
    });
  }

  unlockAchievement(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return;

    const userData = window.State?.getUserData();
    if (!userData || userData.achievements.includes(achievementId)) return;

    console.log(`🏆 Achievement unlocked: ${achievement.name}`);

    // Add to user achievements
    if (window.State) {
      window.State.addAchievement(achievementId);

      // Award XP bonus
      if (achievement.xpReward) {
        window.State.addXP(achievement.xpReward);
      }
    }

    // Show achievement notification
    this.showAchievementNotification(achievement);

    // Update achievement badges in UI
    this.updateAchievementBadges();

    // Send parent notification for major achievements
    this.checkParentNotification(achievement);
  }

  showAchievementNotification(achievement) {
    // Create achievement notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <div class="achievement-title">Achievement Unlocked!</div>
          <div class="achievement-name">${achievement.name}</div>
          <div class="achievement-desc">${achievement.description}</div>
          <div class="achievement-reward">+${achievement.xpReward} XP</div>
        </div>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: var(--gradient-surface);
      border: 2px solid var(--primary);
      border-radius: var(--border-radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      max-width: 400px;
      text-align: center;
      animation: achievementPop 3s ease-out forwards;
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes achievementPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        30% { transform: translate(-50%, -50%) scale(1); }
        90% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      }

      .achievement-content {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .achievement-icon {
        font-size: 3rem;
        filter: drop-shadow(0 0 10px var(--primary));
      }

      .achievement-text {
        flex: 1;
        text-align: left;
      }

      .achievement-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary);
        margin-bottom: 0.5rem;
      }

      .achievement-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text);
        margin-bottom: 0.25rem;
      }

      .achievement-desc {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
      }

      .achievement-reward {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--success);
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 3000);

    // Play achievement sound (if available)
    this.playAchievementSound();
  }

  playAchievementSound() {
    // Create a simple achievement sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Silently fail if Web Audio API is not supported
    }
  }

  updateAchievementBadges() {
    const achievementBadges = document.getElementById('achievementBadges');
    if (!achievementBadges) return;

    const userData = window.State?.getUserData();
    if (!userData) return;

    // Clear existing badges
    achievementBadges.innerHTML = '';

    // Show recent achievements (last 5)
    const recentAchievements = userData.achievements.slice(-5);
    const totalSlots = 5;

    // Add unlocked achievement badges
    recentAchievements.forEach(achievementId => {
      const achievement = this.achievements[achievementId];
      if (achievement) {
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.textContent = achievement.icon;
        badge.title = `${achievement.name}: ${achievement.description}`;
        achievementBadges.appendChild(badge);
      }
    });

    // Add locked badges for remaining slots
    const lockedSlots = totalSlots - recentAchievements.length;
    for (let i = 0; i < lockedSlots; i++) {
      const badge = document.createElement('div');
      badge.className = 'badge locked';
      badge.textContent = '🔒';
      badge.title = 'Locked achievement';
      achievementBadges.appendChild(badge);
    }
  }

  checkParentNotification(achievement) {
    // Send email for major achievements
    const majorAchievements = [
      'level-5', 'level-10', 'questions-50', 'questions-100',
      'streak-7', 'streak-30', 'accuracy-90'
    ];

    if (majorAchievements.includes(achievement.id) && window.Email) {
      const userData = window.State?.getUserData();
      window.Email.sendAchievementNotification(userData, achievement);
    }
  }

  // Get achievement progress for UI
  getAchievementProgress() {
    const userData = window.State?.getUserData();
    if (!userData) return { unlocked: 0, total: 0, recent: [] };

    const totalAchievements = Object.keys(this.achievements).length;
    const unlockedCount = userData.achievements.length;
    const recentAchievements = userData.achievements.slice(-3).map(id => this.achievements[id]);

    return {
      unlocked: unlockedCount,
      total: totalAchievements,
      recent: recentAchievements,
      progress: Math.round((unlockedCount / totalAchievements) * 100)
    };
  }

  // Get next achievements to unlock
  getNextAchievements(count = 3) {
    const userData = window.State?.getUserData();
    if (!userData) return [];

    const nextAchievements = [];

    Object.values(this.achievements).forEach(achievement => {
      if (!userData.achievements.includes(achievement.id)) {
        // Calculate how close the user is to unlocking this achievement
        const progress = this.calculateAchievementProgress(achievement, userData);
        nextAchievements.push({ ...achievement, progress });
      }
    });

    // Sort by progress (closest to completion first)
    nextAchievements.sort((a, b) => b.progress - a.progress);

    return nextAchievements.slice(0, count);
  }

  calculateAchievementProgress(achievement, userData) {
    // This is a simplified progress calculation
    // In a real implementation, you'd want more sophisticated progress tracking

    if (achievement.id.includes('questions-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      return Math.min(100, (userData.totalQuestions / target) * 100);
    }

    if (achievement.id.includes('level-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      return Math.min(100, (userData.level / target) * 100);
    }

    if (achievement.id.includes('streak-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      return Math.min(100, (userData.streak / target) * 100);
    }

    if (achievement.id.includes('accuracy-')) {
      const target = parseInt(achievement.id.split('-')[1]);
      const currentAccuracy = userData.totalQuestions > 0 ?
        (userData.correctAnswers / userData.totalQuestions) * 100 : 0;
      return Math.min(100, (currentAccuracy / target) * 100);
    }

    return 0;
  }

  // Debug methods
  unlockAllAchievements() {
    Object.keys(this.achievements).forEach(achievementId => {
      this.unlockAchievement(achievementId);
    });
  }

  resetAchievements() {
    if (window.State) {
      const userData = window.State.getUserData();
      userData.achievements = [];
      window.State.setUserData(userData);
    }
  }
}

// Create global instance
window.Game = new GameSystem();
