// Main Application Controller
class DLTestApp {
  constructor() {
    this.currentScreen = 'home';
    this.isInitializese;
    this.version = '1.0.0';
  }

  async init() {
    if (this.isInitialized) return;

    console.log('🚗 Initializing SD Driver\'s License Test Prep App v' + this.version);

    try {
      // Initialize core modules
      await this.initializeModules();

      // Setup event listeners
      this.setupEventListeners();

      // Load initial data
      await this.loadInitialData();

      // Show home screen
      this.showScreen('home');

      this.isInitialized = true;
      console.log('✅ App initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError('Failed to load app. Please refresh the page.');
    }
  }

  async initializeModules() {
    // Initialize storage
    if (window.Storage) {
      await window.Storage.init();
    }

    // Initialize state management
    if (window.State) {
      window.State.init();
    }

    // Initialize game system
    if (window.Game) {
      window.Game.init();
    }

    // Initialize progress tracking
    if (window.Progress) {
      window.Progress.init();
    }

    // Initialize UI
    if (window.UI) {
      window.UI.init();
    }
  }

  setupEventListeners() {
    // Navigation buttons
    const studyModeBtn = document.getElementById('studyModeBtn');
    const mockTestBtn = document.getElementById('mockTestBtn');
    const weakAreasBtn = document.getElementById('weakAreasBtn');
    const roadSignsBtn = document.getElementById('roadSignsBtn');

    if (studyModeBtn) {
      studyModeBtn.addEventListener('click', () => this.startStudyMode());
    }

    if (mockTestBtn) {
      mockTestBtn.addEventListener('click', () => this.startMockTest());
    }

    if (weakAreasBtn) {
      weakAreasBtn.addEventListener('click', () => this.showWeakAreas());
    }

    if (roadSignsBtn) {
      roadSignsBtn.addEventListener('click', () => this.showRoadSigns());
    }

    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
      btn.addEventListener('click', () => this.showScreen('home'));
    });
  }

  async loadInitialData() {
    // Load user data
    const userData = await window.Storage?.get('userData') || {
      name: 'Christian',
      level: 1,
      xp: 0,
      streak: 0,
      totalQuestions: 0,
      correctAnswers: 0
    };

    // Update UI with user data
    this.updateUserInfo(userData);

    // Load questions if available
    if (window.Questions) {
      await window.Questions.loadQuestions();
    }
  }

  updateUserInfo(userData) {
    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');
    const userXP = document.getElementById('userXP');
    const streakDisplay = document.getElementById('streakDisplay');
    const xpProgressBar = document.getElementById('xpProgressBar');
    const xpProgressText = document.getElementById('xpProgressText');

    if (userName) userName.textContent = userData.name || 'Christian';
    if (userLevel) userLevel.textContent = `🏆 Level ${userData.level || 1}`;
    if (userXP) userXP.textContent = `⭐ ${userData.xp || 0} XP`;
    if (streakDisplay) streakDisplay.textContent = `🔥 ${userData.streak || 0} Day Streak`;

    // Calculate XP progress for current level
    const currentLevelXP = this.getXPForLevel(userData.level || 1);
    const nextLevelXP = this.getXPForLevel((userData.level || 1) + 1);
    const progressPercent = Math.min(100, ((userData.xp || 0) - currentLevelXP) / (nextLevelXP - currentLevelXP) * 100);

    if (xpProgressBar) xpProgressBar.style.width = `${progressPercent}%`;
    if (xpProgressText) xpProgressText.textContent = `${Math.round(progressPercent)}%`;

    // Update readiness score
    this.updateReadinessScore(userData);

    // Update progress summary
    this.updateProgressSummary();
  }

  getXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  updateReadinessScore(userData) {
    const readinessScore = document.getElementById('readinessScore');
    const readinessProgressBar = document.getElementById('readinessProgressBar');
    const readinessMessage = document.getElementById('readinessMessage');

    // Calculate readiness based on various factors
    let score = 0;

    // Base score from accuracy
    if (userData.totalQuestions > 0) {
      const accuracy = userData.correctAnswers / userData.totalQuestions;
      score += accuracy * 60; // Up to 60 points for accuracy
    }

    // Bonus for experience
    score += Math.min(25, userData.totalQuestions * 0.5); // Up to 25 points for experience

    // Bonus for streak
    score += Math.min(15, userData.streak * 2); // Up to 15 points for streak

    score = Math.min(100, Math.round(score));

    if (readinessScore) readinessScore.textContent = `${score}/100`;
    if (readinessProgressBar) readinessProgressBar.style.width = `${score}%`;

    // Update message based on score
    let message = '🚀 Start practicing!';
    if (score >= 80) message = '🎉 Ready to take the test!';
    else if (score >= 60) message = '🚀 Almost ready! Keep practicing!';
    else if (score >= 40) message = '📚 Good progress! Keep studying!';
    else if (score >= 20) message = '💪 You\'re getting there!';

    if (readinessMessage) readinessMessage.textContent = message;
  }

  updateProgressSummary() {
    const progress = window.State?.getProgress();
    if (!progress) return;

    const weakAreasCount = document.getElementById('weakAreasCount');
    const masteredCount = document.getElementById('masteredCount');
    const categoriesStudied = document.getElementById('categoriesStudied');
    const weakAreasList = document.getElementById('weakAreasList');
    const weakAreasTags = document.getElementById('weakAreasTags');

    // Update counts
    if (weakAreasCount) weakAreasCount.textContent = progress.weakAreas.length;
    if (masteredCount) masteredCount.textContent = progress.masteredTopics.length;

    // Count categories with at least 3 questions answered
    const studiedCategories = Object.keys(progress.categories).filter(cat =>
      progress.categories[cat].total >= 3
    ).length;
    if (categoriesStudied) categoriesStudied.textContent = `${studiedCategories}/9`;

    // Show weak areas if any exist
    if (weakAreasList && weakAreasTags) {
      if (progress.weakAreas.length > 0) {
        weakAreasList.style.display = 'block';
        weakAreasTags.innerHTML = '';

        progress.weakAreas.forEach(area => {
          const tag = document.createElement('span');
          tag.className = 'weak-area-tag';
          tag.textContent = this.formatCategoryName(area);
          weakAreasTags.appendChild(tag);
        });
      } else {
        weakAreasList.style.display = 'none';
      }
    }
  }

  formatCategoryName(category) {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
      targetScreen.classList.add('active');
      this.currentScreen = screenName;
    }
  }

  startStudyMode() {
    console.log('Starting study mode...');
    this.showScreen('study');
    // Initialize study session
    if (window.Questions) {
      window.Questions.startStudySession();
    }
  }

  startMockTest() {
    console.log('Starting mock test...');
    this.showScreen('study');
    // Initialize mock test session (25 questions, mixed categories)
    if (window.Questions) {
      window.Questions.startStudySession({
        count: 25,
        mode: 'mock-test'
      });
    }
  }

  showWeakAreas() {
    console.log('Showing weak areas...');
    const progress = window.State?.getProgress();
    if (!progress || progress.weakAreas.length === 0) {
      this.showNotification('No weak areas identified yet. Keep practicing!', 'info');
      return;
    }

    this.showScreen('study');
    // Initialize weak areas session
    if (window.Questions) {
      window.Questions.startStudySession({
        count: 15,
        mode: 'weak-areas'
      });
    }
  }

  showRoadSigns() {
    console.log('Showing road signs...');
    this.showScreen('study');
    // Initialize road signs session
    if (window.Questions) {
      window.Questions.startStudySession({
        count: 20,
        mode: 'road-signs'
      });
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-text">${message}</span>
      <button class="notification-close">×</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  getVersion() {
    return this.version;
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DLTestApp();
  window.app.init();
});

// Export for use in other modules
window.DLTestApp = DLTestApp;
