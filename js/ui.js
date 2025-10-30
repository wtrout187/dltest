// UI Management and Theme System
class UIManager {
  constructor() {
    this.isInitialized = false;
    this.currentTheme = 'dark';
    this.notifications = [];
  }

  init() {
    if (this.isInitialized) return;

    console.log('🎨 Initializing UI manager...');

    // Initialize theme
    this.initializeTheme();

    // Setup event listeners
    this.setupEventListeners();

    // Initialize notifications
    this.initializeNotifications();

    this.isInitialized = true;
    console.log('✅ UI manager initialized');
  }

  initializeTheme() {
    // Get saved theme or default to dark
    const savedTlocalStorage.getItem('dltest_theme') || 'dark';
    this.setTheme(savedTheme);
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Navigation
    this.setupNavigation();

    // Screen transitions
    this.setupScreenTransitions();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  setupNavigation() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navContainer = document.querySelector('.nav-container');

    if (navToggle && navContainer) {
      navToggle.addEventListener('click', () => {
        navContainer.classList.toggle('nav-open');
      });
    }

    // Settings button
    const navSettings = document.getElementById('navSettings');
    if (navSettings) {
      navSettings.addEventListener('click', () => {
        this.showSettings();
      });
    }
  }

  setupScreenTransitions() {
    // Add smooth transitions between screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'opacity' && !screen.classList.contains('active')) {
          screen.style.display = 'none';
        }
      });
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape key to go back
      if (e.key === 'Escape') {
        this.goBack();
      }

      // Theme toggle with Ctrl/Cmd + T
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }

      // Quick navigation with number keys
      if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey) {
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen && currentScreen.id === 'homeScreen') {
          const actions = ['studyModeBtn', 'mockTestBtn', 'weakAreasBtn', 'roadSignsBtn'];
          const buttonId = actions[parseInt(e.key) - 1];
          const button = document.getElementById(buttonId);
          if (button) {
            button.click();
          }
        }
      }
    });
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dltest_theme', theme);

    // Update theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.title = `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`;
    }

    // Emit theme change event
    if (window.State) {
      window.State.setTheme(theme);
    }

    console.log(`🎨 Theme changed to: ${theme}`);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  showScreen(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.classList.remove('active');
      screen.style.display = 'none';
    });

    // Show target screen
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
      targetScreen.style.display = 'block';
      // Force reflow
      targetScreen.offsetHeight;
      targetScreen.classList.add('active');

      // Update state
      if (window.State) {
        window.State.setCurrentScreen(screenName);
      }
    }
  }

  goBack() {
    const currentScreen = window.State?.getUIState().currentScreen || 'home';

    if (currentScreen !== 'home') {
      this.showScreen('home');
    }
  }

  initializeNotifications() {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'notificationContainer';
      notificationContainer.className = 'notification-container';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(notificationContainer);
    }
  }

  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    const id = Date.now().toString();

    notification.className = `notification ${type} show`;
    notification.style.cssText = `
      background: var(--gradient-surface);
      border: 1px solid var(--border);
      border-radius: var(--border-radius-lg);
      padding: 1rem 1.5rem;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      gap: 1rem;
      transform: translateX(400px);
      transition: var(--transition);
      max-width: 350px;
      backdrop-filter: var(--backdrop-blur);
      pointer-events: auto;
    `;

    // Set type-specific styles
    switch (type) {
      case 'success':
        notification.style.borderColor = 'var(--success)';
        notification.style.background = 'rgba(81, 207, 102, 0.1)';
        break;
      case 'error':
        notification.style.borderColor = 'var(--danger)';
        notification.style.background = 'rgba(255, 107, 107, 0.1)';
        break;
      case 'warning':
        notification.style.borderColor = 'var(--warning)';
        notification.style.background = 'rgba(255, 212, 59, 0.1)';
        break;
    }

    notification.innerHTML = `
      <span class="notification-text" style="flex: 1; color: var(--text); font-size: 0.9rem; font-weight: 500;">
        ${message}
      </span>
      <button class="notification-close" style="
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0.25rem;
        border-radius: var(--border-radius);
        transition: var(--transition);
        min-width: 24px;
        min-height: 24px;
      ">×</button>
    `;

    const container = document.getElementById('notificationContainer');
    if (container) {
      container.appendChild(notification);

      // Show notification
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);

      // Auto-hide
      const hideTimeout = setTimeout(() => {
        this.hideNotification(notification);
      }, duration);

      // Close button
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        this.hideNotification(notification);
      });

      // Hover to pause auto-hide
      notification.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
      });

      notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
          this.hideNotification(notification);
        }, 2000);
      });
    }

    return id;
  }

  hideNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  showSettings() {
    // Create settings modal
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(10px);
    `;

    const userData = window.State?.getUserData();
    const settings = userData?.preferences || {};

    modal.innerHTML = `
      <div class="settings-content" style="
        background: var(--gradient-surface);
        border: 1px solid var(--border);
        border-radius: var(--border-radius-lg);
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow-lg);
      ">
        <div class="settings-header" style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
        ">
          <h2 style="color: var(--text); font-size: 1.5rem; font-weight: 700;">⚙️ Settings</h2>
          <button class="close-settings" style="
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

        <div class="settings-section">
          <h3 style="color: var(--text); margin-bottom: 1rem;">🎨 Appearance</h3>
          <div class="setting-item" style="margin-bottom: 1rem;">
            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Theme</label>
            <select id="themeSelect" style="
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: var(--border-radius);
              padding: 0.75rem;
              color: var(--text);
              width: 100%;
            ">
              <option value="dark" ${this.currentTheme === 'dark' ? 'selected' : ''}>🌙 Dark</option>
              <option value="light" ${this.currentTheme === 'light' ? 'selected' : ''}>☀️ Light</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3 style="color: var(--text); margin-bottom: 1rem;">📧 Notifications</h3>
          <div class="setting-item" style="margin-bottom: 1rem;">
            <label style="color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">Parent Email</label>
            <input type="email" id="parentEmail" value="${settings.parentEmail || 'wtrout@hotmail.com'}" style="
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: var(--border-radius);
              padding: 0.75rem;
              color: var(--text);
              width: 100%;
            ">
          </div>
          <div class="setting-item" style="margin-bottom: 1rem;">
            <label style="
              display: flex;
              align-items: center;
              gap: 0.5rem;
              color: var(--text);
              cursor: pointer;
            ">
              <input type="checkbox" id="enableNotifications" ${settings.notifications !== false ? 'checked' : ''} style="
                width: 18px;
                height: 18px;
              ">
              Enable email notifications
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3 style="color: var(--text); margin-bottom: 1rem;">📊 Data</h3>
          <div class="setting-buttons" style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button id="exportData" style="
              background: var(--gradient-primary);
              border: none;
              border-radius: var(--border-radius);
              padding: 0.75rem 1.5rem;
              color: white;
              cursor: pointer;
              transition: var(--transition);
            ">📤 Export Data</button>
            <button id="resetProgress" style="
              background: var(--gradient-secondary);
              border: none;
              border-radius: var(--border-radius);
              padding: 0.75rem 1.5rem;
              color: white;
              cursor: pointer;
              transition: var(--transition);
            ">🔄 Reset Progress</button>
          </div>
        </div>

        <div class="settings-footer" style="
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        ">
          <button class="cancel-settings" style="
            background: none;
            border: 1px solid var(--border);
            border-radius: var(--border-radius);
            padding: 0.75rem 1.5rem;
            color: var(--text);
            cursor: pointer;
            transition: var(--transition);
          ">Cancel</button>
          <button class="save-settings" style="
            background: var(--gradient-primary);
            border: none;
            border-radius: var(--border-radius);
            padding: 0.75rem 1.5rem;
            color: white;
            cursor: pointer;
            transition: var(--transition);
          ">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup event listeners
    const closeBtn = modal.querySelector('.close-settings');
    const cancelBtn = modal.querySelector('.cancel-settings');
    const saveBtn = modal.querySelector('.save-settings');
    const themeSelect = modal.querySelector('#themeSelect');
    const exportBtn = modal.querySelector('#exportData');
    const resetBtn = modal.querySelector('#resetProgress');

    const closeModal = () => {
      modal.remove();
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    themeSelect.addEventListener('change', (e) => {
      this.setTheme(e.target.value);
    });

    saveBtn.addEventListener('click', () => {
      const parentEmail = modal.querySelector('#parentEmail').value;
      const notifications = modal.querySelector('#enableNotifications').checked;

      // Update settings
      if (window.Storage) {
        window.Storage.updateUserData({
          preferences: {
            parentEmail,
            notifications,
            theme: this.currentTheme
          }
        });
      }

      // Update email system
      if (window.Email) {
        window.Email.updateParentEmail(parentEmail);
      }

      this.showNotification('Settings saved successfully!', 'success');
      closeModal();
    });

    exportBtn.addEventListener('click', async () => {
      try {
        const data = await window.Storage?.exportData();
        if (data) {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `dltest-data-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);
          this.showNotification('Data exported successfully!', 'success');
        }
      } catch (error) {
        this.showNotification('Failed to export data', 'error');
      }
    });

    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        if (window.State) {
          window.State.resetProgress();
        }
        if (window.Storage) {
          window.Storage.clear();
        }
        this.showNotification('Progress reset successfully!', 'success');
        closeModal();
        // Reload page to reset UI
        setTimeout(() => location.reload(), 1000);
      }
    });
  }

  showLoading(show = true) {
    let loader = document.getElementById('globalLoader');

    if (show && !loader) {
      loader = document.createElement('div');
      loader.id = 'globalLoader';
      loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
      `;

      loader.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--text);
        ">
          <div class="loading" style="
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s linear infinite;
          "></div>
          <div style="font-size: 1.1rem; font-weight: 500;">Loading...</div>
        </div>
      `;

      document.body.appendChild(loader);
    } else if (!show && loader) {
      loader.remove();
    }
  }

  updateProgressBars() {
    // Update all progress bars with smooth animations
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 100);
    });
  }

  // Utility methods
  formatNumber(num) {
    return num.toLocaleString();
  }

  formatPercentage(num) {
    return `${Math.round(num)}%`;
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString();
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString();
  }

  // Accessibility helpers
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  // Focus management
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });

    firstElement?.focus();
  }
}

// Create global instance
window.UI = new UIManager();
