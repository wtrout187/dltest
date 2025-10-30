// Global State Management with Event System
class StateManager {
  constructor() {
    this.state = {
      user{
        name: 'Christian',
        level: 1,
        xp: 0,
        streak: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        studySessions: 0,
        achievements: [],
        lastStudyDate: null
      },
      session: {
        currentQuestion: null,
        questionIndex: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        startTime: null,
        mode: null // 'study', 'test', 'weak-areas', 'road-signs'
      },
      ui: {
        currentScreen: 'home',
        theme: 'dark',
        loading: false,
        notifications: []
      },
      progress: {
        categories: {},
        weakAreas: [],
        masteredTopics: [],
        readinessScore: 0
      }
    };

    this.listeners = new Map();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    console.log('🔄 Initializing state manager...');

    // Load saved state
    this.loadState();

    // Setup auto-save
    this.setupAutoSave();

    this.isInitialized = true;
    console.log('✅ State manager initialized');
  }

  async loadState() {
    try {
      if (window.Storage) {
        const userData = await window.Storage.get('userData');
        const progress = await window.Storage.get('progress');
        const settings = await window.Storage.get('settings');

        if (userData) {
          this.state.user = { ...this.state.user, ...userData };
        }

        if (progress) {
          this.state.progress = { ...this.state.progress, ...progress };
        }

        if (settings) {
          this.state.ui.theme = settings.theme || 'dark';
        }

        // Emit loaded event
        this.emit('state:loaded', this.state);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  setupAutoSave() {
    // Save state every 30 seconds
    setInterval(() => {
      this.saveState();
    }, 30000);

    // Save on page unload
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
  }

  async saveState() {
    try {
      if (window.Storage) {
        await window.Storage.set('userData', this.state.user);
        await window.Storage.set('progress', this.state.progress);
        await window.Storage.set('settings', {
          theme: this.state.ui.theme,
          notifications: true,
          parentEmail: 'wtrout@hotmail.com'
        });
      }
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // State getters
  getState() {
    return { ...this.state };
  }

  getUserData() {
    return { ...this.state.user };
  }

  getSessionData() {
    return { ...this.state.session };
  }

  getUIState() {
    return { ...this.state.ui };
  }

  getProgress() {
    return { ...this.state.progress };
  }

  // State setters
  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.emit('state:changed', { oldState, newState: this.state });
  }

  setUserData(userData) {
    const oldUser = { ...this.state.user };
    this.state.user = { ...this.state.user, ...userData };
    this.emit('user:changed', { oldUser, newUser: this.state.user });
    this.saveState();
  }

  setSessionData(sessionData) {
    const oldSession = { ...this.state.session };
    this.state.session = { ...this.state.session, ...sessionData };
    this.emit('session:changed', { oldSession, newSession: this.state.session });
  }

  setUIState(uiState) {
    const oldUI = { ...this.state.ui };
    this.state.ui = { ...this.state.ui, ...uiState };
    this.emit('ui:changed', { oldUI, newUI: this.state.ui });
  }

  setProgress(progress) {
    const oldProgress = { ...this.state.progress };
    this.state.progress = { ...this.state.progress, ...progress };
    this.emit('progress:changed', { oldProgress, newProgress: this.state.progress });
    this.saveState();
  }

  // Specific actions
  addXP(amount) {
    const oldXP = this.state.user.xp;
    const oldLevel = this.state.user.level;

    this.state.user.xp += amount;

    // Check for level up
    const newLevel = this.calculateLevel(this.state.user.xp);
    if (newLevel > oldLevel) {
      this.state.user.level = newLevel;
      this.emit('user:levelup', {
        oldLevel,
        newLevel,
        xp: this.state.user.xp
      });
    }

    this.emit('user:xp', {
      oldXP,
      newXP: this.state.user.xp,
      amount
    });

    this.saveState();
  }

  calculateLevel(xp) {
    // Level formula: level = floor(sqrt(xp / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  getXPForLevel(level) {
    // XP needed for level: xp = (level - 1)^2 * 100
    return Math.pow(level - 1, 2) * 100;
  }

  answerQuestion(correct, category = 'general') {
    this.state.user.totalQuestions++;
    this.state.session.totalQuestions++;

    if (correct) {
      this.state.user.correctAnswers++;
      this.state.session.correctAnswers++;
      this.addXP(10); // 10 XP per correct answer
    }

    // Update category progress
    if (!this.state.progress.categories[category]) {
      this.state.progress.categories[category] = {
        total: 0,
        correct: 0,
        accuracy: 0
      };
    }

    this.state.progress.categories[category].total++;
    if (correct) {
      this.state.progress.categories[category].correct++;
    }

    this.state.progress.categories[category].accuracy =
      Math.round((this.state.progress.categories[category].correct /
                 this.state.progress.categories[category].total) * 100);

    // Update weak areas (more responsive - only need 3 questions to identify)
    const categoryData = this.state.progress.categories[category];

    if (categoryData.total >= 3) {
      if (categoryData.accuracy < 70) {
        if (!this.state.progress.weakAreas.includes(category)) {
          this.state.progress.weakAreas.push(category);
          console.log(`Added ${category} to weak areas (${categoryData.accuracy}% accuracy)`);
        }
      } else if (categoryData.accuracy >= 80) {
        // Remove from weak areas if improved
        const index = this.state.progress.weakAreas.indexOf(category);
        if (index > -1) {
          this.state.progress.weakAreas.splice(index, 1);
          console.log(`Removed ${category} from weak areas (improved to ${categoryData.accuracy}%)`);
        }

        // Add to mastered topics if accuracy is very high
        if (categoryData.accuracy >= 90 && categoryData.total >= 5) {
          if (!this.state.progress.masteredTopics.includes(category)) {
            this.state.progress.masteredTopics.push(category);
            console.log(`Added ${category} to mastered topics (${categoryData.accuracy}% accuracy)`);
          }
        }
      }
    }

    this.emit('question:answered', {
      correct,
      category,
      totalQuestions: this.state.user.totalQuestions,
      correctAnswers: this.state.user.correctAnswers,
      accuracy: Math.round((this.state.user.correctAnswers / this.state.user.totalQuestions) * 100)
    });

    this.saveState();
  }

  startSession(mode) {
    this.state.session = {
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      startTime: new Date().toISOString(),
      mode
    };

    this.emit('session:started', { mode });
  }

  endSession() {
    const sessionData = { ...this.state.session };

    // Update user stats
    this.state.user.studySessions++;

    // Update streak
    const today = new Date().toDateString();
    const lastStudyDate = this.state.user.lastStudyDate;

    if (lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastStudyDate === yesterday.toDateString()) {
        this.state.user.streak++;
      } else if (lastStudyDate !== today) {
        this.state.user.streak = 1;
      }

      this.state.user.lastStudyDate = today;
    }

    // Calculate readiness score
    this.updateReadinessScore();

    this.emit('session:ended', sessionData);

    // Reset session
    this.state.session = {
      currentQuestion: null,
      questionIndex: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      startTime: null,
      mode: null
    };

    this.saveState();
  }

  updateReadinessScore() {
    let score = 0;

    // Base score from overall accuracy
    if (this.state.user.totalQuestions > 0) {
      const accuracy = this.state.user.correctAnswers / this.state.user.totalQuestions;
      score += accuracy * 60; // Up to 60 points
    }

    // Experience bonus
    score += Math.min(25, this.state.user.totalQuestions * 0.5); // Up to 25 points

    // Streak bonus
    score += Math.min(15, this.state.user.streak * 2); // Up to 15 points

    this.state.progress.readinessScore = Math.min(100, Math.round(score));

    this.emit('readiness:updated', {
      score: this.state.progress.readinessScore
    });
  }

  addAchievement(achievementId) {
    if (!this.state.user.achievements.includes(achievementId)) {
      this.state.user.achievements.push(achievementId);
      this.emit('achievement:unlocked', { achievementId });
      this.saveState();
    }
  }

  // Theme management
  setTheme(theme) {
    this.state.ui.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dltest_theme', theme);
    this.emit('theme:changed', { theme });
  }

  // Screen management
  setCurrentScreen(screen) {
    const oldScreen = this.state.ui.currentScreen;
    this.state.ui.currentScreen = screen;
    this.emit('screen:changed', { oldScreen, newScreen: screen });
  }

  // Loading state
  setLoading(loading) {
    this.state.ui.loading = loading;
    this.emit('loading:changed', { loading });
  }

  // Notifications
  addNotification(notification) {
    const id = Date.now().toString();
    const notificationWithId = { ...notification, id };
    this.state.ui.notifications.push(notificationWithId);
    this.emit('notification:added', notificationWithId);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(id);
    }, 5000);

    return id;
  }

  removeNotification(id) {
    const index = this.state.ui.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      const notification = this.state.ui.notifications.splice(index, 1)[0];
      this.emit('notification:removed', notification);
    }
  }

  // Debug methods
  resetProgress() {
    this.state.user = {
      name: 'Christian',
      level: 1,
      xp: 0,
      streak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      studySessions: 0,
      achievements: [],
      lastStudyDate: null
    };

    this.state.progress = {
      categories: {},
      weakAreas: [],
      masteredTopics: [],
      readinessScore: 0
    };

    this.saveState();
    this.emit('progress:reset');
  }

  getDebugInfo() {
    return {
      state: this.state,
      listeners: Array.from(this.listeners.keys()),
      isInitialized: this.isInitialized
    };
  }
}

// Create global instance
window.State = new StateManager();
