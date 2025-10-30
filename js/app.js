// Main Application Controller
class DLTestApp {
  constructor() {
    this.currentScreen = 'home';
    this.isInitialized = false;
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

      // Check if first time user
      const isFirstTime = !localStorage.getItem('dltest_visited');
      if (isFirstTime) {
        this.showWelcomeScreen();
      } else {
        this.showScreen('home');
      }

      this.isInitialized = true;
      console.log('✅ App initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError('Failed to load app. Please refresh the page.');
    }
  }

  async initializeModules() {
    console.log('🔧 Initializing modules...');

    // Initialize storage
    if (window.Storage) {
      console.log('📦 Initializing Storage...');
      await window.Storage.init();
    } else {
      console.error('❌ Storage module not found!');
    }

    // Initialize state management
    if (window.State) {
      console.log('🔄 Initializing State...');
      window.State.init();

      // Listen to state changes and update UI immediately
      window.State.on('user:changed', (data) => {
        console.log('👤 User data changed, updating UI...');
        this.updateUserInfo(data.newUser);
      });

      window.State.on('progress:changed', (data) => {
        console.log('📊 Progress changed, updating UI...');
        this.updateProgressSummary();
      });

      window.State.on('question:answered', (data) => {
        console.log('🎯 Question answered, updating UI...');
        // Update UI immediately after each question
        setTimeout(() => {
          const userData = window.State.getUserData();
          this.updateUserInfo(userData);
        }, 100);
      });
    } else {
      console.error('❌ State module not found!');
    }

    // Initialize game system
    if (window.Game) {
      console.log('🎮 Initializing Game...');
      window.Game.init();
    } else {
      console.error('❌ Game module not found!');
    }

    // Initialize progress tracking
    if (window.Progress) {
      console.log('📊 Initializing Progress...');
      window.Progress.init();
    } else {
      console.error('❌ Progress module not found!');
    }

    // Initialize UI
    if (window.UI) {
      console.log('🎨 Initializing UI...');
      window.UI.init();
    } else {
      console.error('❌ UI module not found!');
    }

    console.log('✅ All modules initialized');
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

    // Update progress summary
    this.updateProgressSummary();

    // Load questions if available
    if (window.Questions) {
      await window.Questions.loadQuestions();
    }
  }

  updateUserInfo(userData) {
    console.log('🔄 updateUserInfo called with:', {
      totalQuestions: userData.totalQuestions,
      correctAnswers: userData.correctAnswers,
      xp: userData.xp,
      level: userData.level,
      streak: userData.streak
    });

    const userName = document.getElementById('userName');
    const userLevel = document.getElementById('userLevel');
    const userXP = document.getElementById('userXP');
    const streakDisplay = document.getElementById('streakDisplay');
    const xpProgressBar = document.getElementById('xpProgressBar');
    const xpProgressText = document.getElementById('xpProgressText');

    console.log('🎯 UI Elements found:', {
      userName: !!userName,
      userLevel: !!userLevel,
      userXP: !!userXP,
      streakDisplay: !!streakDisplay
    });

    if (userName) userName.textContent = userData.name || 'Christian';
    if (userLevel) userLevel.textContent = `🏆 Level ${userData.level || 1}`;
    if (userXP) userXP.textContent = `⭐ ${userData.xp || 0} XP`;
    if (streakDisplay) streakDisplay.textContent = `🔥 ${userData.streak || 0} Day Streak`;

    // Also update study screen elements if they exist
    const studyXP = document.getElementById('studyXP');
    const studyLevel = document.getElementById('studyLevel');
    if (studyXP) studyXP.textContent = `⭐ ${userData.xp || 0} XP`;
    if (studyLevel) studyLevel.textContent = `🏆 Level ${userData.level || 1}`;

    console.log('✅ UI updated with values:', {
      level: userData.level,
      xp: userData.xp,
      streak: userData.streak,
      totalQuestions: userData.totalQuestions
    });

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

  showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    if (welcomeScreen) {
      welcomeScreen.style.display = 'flex';

      // Setup welcome scr', wbuttons
      const startLearning = document.getElementById('startLearning');
      const showInstructions = document.getElementById('showInstructions');

      if (startLearning) {
        startLearning.addEventListener('click', () => {
          localStorage.setItem('dltest_visited', 'true');
          welcomeScreen.style.display = 'none';
          this.showScreen('home');
          this.showNotification('🎉 Welcome to your personalized driver\'s test prep! Let\'s get you ready for that license!', 'success', 6000);
        });
      }

      if (showInstructions) {
        showInstructions.addEventListener('click', () => {
          this.showInstructions();
        });
      }
    }
  }

  showInstructions() {
    const modal = document.createElement('div');
    modal.className = 'instructions-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      backdrop-filter: blur(10px);
    `;

    modal.innerHTML = `
      <div class="instructions-content" style="
        background: var(--gradient-surface);
        border: 1px solid var(--border);
        border-radius: var(--border-radius-lg);
        padding: 2rem;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
      ">
        <div class="instructions-header" style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        ">
          <h2 style="color: var(--text); font-size: 2rem; font-weight: 700;">📖 How to Use This App</h2>
          <button class="close-instructions" style="
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
            padding: 0.5rem;
            border-radius: var(--border-radius);
            transition: var(--transition);
          ">×</button>
        </div>

        <div class="instruction-section">
          <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.3rem;">🎮 Gamified Learning System</h3>
          <ul style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
            <li><strong>XP Points:</strong> Earn 10 XP for each correct answer</li>
            <li><strong>Levels:</strong> Level up as you gain XP - higher levels unlock achievements</li>
            <li><strong>Daily Streaks:</strong> Study every day to build your streak and earn bonus XP</li>
            <li><strong>Achievements:</strong> Unlock badges for milestones like "Century Club" (100 questions)</li>
          </ul>
        </div>

        <div class="instruction-section">
          <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.3rem;">🧠 Smart Learning Features</h3>
          <ul style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
            <li><strong>Study Mode:</strong> Practice with varied questions across all categories</li>
            <li><strong>Mock Test:</strong> Take a full 25-question practice test just like the real DMV test</li>
            <li><strong>Weak Areas:</strong> The app identifies topics you struggle with and focuses on them</li>
            <li><strong>Road Signs:</strong> Special focus on South Dakota road signs and traffic signals</li>
          </ul>
        </div>

        <div class="instruction-section">
          <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.3rem;">📊 Progress Tracking</h3>
          <ul style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
            <li><strong>Readiness Score:</strong> Shows how ready you are for the real test (aim for 85+)</li>
            <li><strong>Category Progress:</strong> Track your performance in each topic area</li>
            <li><strong>Accuracy Tracking:</strong> See your overall and category-specific accuracy</li>
            <li><strong>Parent Updates:</strong> Dad gets email reports on your progress automatically</li>
          </ul>
        </div>

        <div class="instruction-section">
          <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.3rem;">💡 Pro Tips for Success</h3>
          <ul style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem;">
            <li>🎯 <strong>Study daily:</strong> Even 10 minutes a day builds your streak and knowledge</li>
            <li>🔄 <strong>Focus on weak areas:</strong> The app will highlight what you need to work on</li>
            <li>📱 <strong>Use anywhere:</strong> Study on your phone during breaks, at lunch, or before bed</li>
            <li>🏆 <strong>Aim for 90%:</strong> Get 90% accuracy consistently before taking the real test</li>
            <li>⚡ <strong>Take mock tests:</strong> Practice the full 25-question format regularly</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 2rem;">
          <button class="start-learning-btn" style="
            background: var(--gradient-primary);
            border: none;
            border-radius: var(--border-radius-lg);
            padding: 1rem 2rem;
            color: white;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
          ">🚀 Got It! Let's Start Learning!</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    const closeBtn = modal.querySelector('.close-instructions');
    const startBtn = modal.querySelector('.start-learning-btn');

    const closeModal = () => {
      modal.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    startBtn.addEventListener('click', () => {
      localStorage.setItem('dltest_visited', 'true');
      const welcomeScreen = document.getElementById('welcomeScreen');
      if (welcomeScreen) welcomeScreen.style.display = 'none';
      closeModal();
      this.showScreen('home');
      this.showNotification('🎉 You\'re all set! Start with Study Mode to begin earning XP!', 'success', 5000);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Validation method to check all systems
  validateApp() {
    console.log('🔍 Validating app systems...');

    const checks = {
      questions: window.Questions?.questions?.length > 0,
      state: window.State?.isInitialized,
      game: window.Game?.isInitialized,
      progress: window.Progress?.isInitialized,
      ui: window.UI?.isInitialized,
      storage: window.Storage !== undefined
    };

    console.log('System checks:', checks);

    const allGood = Object.values(checks).every(check => check);
    console.log(allGood ? '✅ All systems operational!' : '⚠️ Some systems need attention');

    return allGood;
  }

  // Test method to manually update UI
  testUIUpdate() {
    console.log('🧪 Testing UI update...');

    // Manually update UI elements
    const userXP = document.getElementById('userXP');
    const userLevel = document.getElementById('userLevel');
    const totalQuestions = document.getElementById('totalQuestions');

    if (userXP) {
      userXP.textContent = '⭐ 999 XP';
      console.log('✅ Updated XP display');
    } else {
      console.error('❌ userXP element not found!');
    }

    if (userLevel) {
      userLevel.textContent = '🏆 Level 99';
      console.log('✅ Updated level display');
    } else {
      console.error('❌ userLevel element not found!');
    }

    if (totalQuestions) {
      totalQuestions.textContent = '999';
      console.log('✅ Updated total questions');
    } else {
      console.error('❌ totalQuestions element not found!');
    }
  }

  // Test method to manually trigger scoring
  testScoring() {
    console.log('🧪 Testing scoring system...');

    if (window.State) {
      // Simulate answering 5 questions correctly
      for (let i = 0; i < 5; i++) {
        window.State.answerQuestion(true, 'traffic-signs');
      }

      // Simulate answering 2 questions incorrectly
      for (let i = 0; i < 2; i++) {
        window.State.answerQuestion(false, 'speed-limits');
      }

      // End session to trigger streak update
      window.State.endSession();

      console.log('✅ Test scoring complete. Check UI for updates.');
    } else {
      console.error('❌ State manager not available for testing!');
    }
  }

  // Debug method to check app state
  debugState() {
    console.log('=== DEBUG STATE ===');
    console.log('Questions loaded:', window.Questions?.questions?.length || 0);
    console.log('User data:', window.State?.getUserData());
    console.log('Progress:', window.State?.getProgress());
    console.log('Session:', window.State?.getSessionData());
    console.log('==================');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DLTestApp();
  window.app.init();

  // Add debug methods to window for testing
  window.debugApp = () => window.app.debugState();
  window.testScoring = () => {
    console.log('🧪 Testing scoring system...');
    if (window.State) {
      // Simulate answering some questions
      window.State.answerQuestion(true, 'traffic-signs');
      window.State.answerQuestion(false, 'traffic-signs');
      window.State.answerQuestion(false, 'traffic-signs');
      window.State.answerQuestion(true, 'speed-limits');

      // Update UI
      if (window.app) {
        const userData = window.State.getUserData();
        window.app.updateUserInfo(userData);
      }

      console.log('✅ Test complete - check the UI for updates');
    } else {
      console.error('❌ State not available for testing');
    }
  };
});

// Export for use in other modules
window.DLTestApp = DLTestApp;
