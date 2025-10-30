// Local Storage Management with Backup
class StorageManager {
  constructor() {
    this.prefix = 'dltest_';
    this.isAvailable = this.checkAvailability();
    this.backupData = new Map();
  }

  checkAvailability() {
    try {
      const test = 'storage_test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using memory backup');
      return false;
    }
  }

  async init() {
    console.log('📦 Initializing storage manager...');

    // Initialize default data if needed
    await this.initializeDefaults();

    console.log('✅ Storage manager initialized');
  }

  async initializeDefaults() {
    const defaults = {
      userData: {
        name: 'Christian',
        level: 1,
        xp: 0,
        streak: 0,
        lastStudyDate: null,
        totalQuestions: 0,
        correctAnswers: 0,
        studySessions: 0,
        achievements: [],
        preferences: {
          theme: 'dark',
          notifications: true,
          parentEmail: 'wtrout@hotmail.com'
        }
      },
      progress: {
        categories: {},
        weakAreas: [],
        masteredTopics: [],
        studyHistory: []
      },
      settings: {
        theme: 'dark',
        notifications: true,
        parentEmail: 'wtrout@hotmail.com',
        studyReminders: true
      }
    };

    // Set defaults if they don't exist
    for (const [key, value] of Object.entries(defaults)) {
      const existing = await this.get(key);
      if (!existing) {
        await this.set(key, value);
      }
    }
  }

  generateKey(key) {
    return this.prefix + key;
  }

  async get(key) {
    const fullKey = this.generateKey(key);

    try {
      if (this.isAvailable) {
        const value = localStorage.getItem(fullKey);
        return value ? JSON.parse(value) : null;
      } else {
        return this.backupData.get(fullKey) || null;
      }
    } catch (error) {
      console.error('Error getting data from storage:', error);
      return this.backupData.get(fullKey) || null;
    }
  }

  async set(key, value) {
    const fullKey = this.generateKey(key);

    try {
      const serialized = JSON.stringify(value);

      if (this.isAvailable) {
        localStorage.setItem(fullKey, serialized);
      }

      // Always keep backup in memory
      this.backupData.set(fullKey, value);

      return true;
    } catch (error) {
      console.error('Error setting data in storage:', error);
      // Fallback to memory storage
      this.backupData.set(fullKey, value);
      return false;
    }
  }

  async remove(key) {
    const fullKey = this.generateKey(key);

    try {
      if (this.isAvailable) {
        localStorage.removeItem(fullKey);
      }
      this.backupData.delete(fullKey);
      return true;
    } catch (error) {
      console.error('Error removing data from storage:', error);
      return false;
    }
  }

  async clear() {
    try {
      if (this.isAvailable) {
        // Remove only our app's data
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
      }

      this.backupData.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  async getAllKeys() {
    try {
      const keys = [];

      if (this.isAvailable) {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith(this.prefix)) {
            keys.push(key.replace(this.prefix, ''));
          }
        });
      } else {
        this.backupData.forEach((value, key) => {
          keys.push(key.replace(this.prefix, ''));
        });
      }

      return keys;
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  async getStorageInfo() {
    try {
      let used = 0;
      let available = 0;

      if (this.isAvailable) {
        // Calculate used space
        let totalSize = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
            totalSize += localStorage[key].length + key.length;
          }
        }
        used = totalSize;

        // Estimate available space (localStorage typically has 5-10MB limit)
        available = 5 * 1024 * 1024; // 5MB estimate
      } else {
        // Memory storage info
        let memorySize = 0;
        this.backupData.forEach((value, key) => {
          memorySize += JSON.stringify(value).length + key.length;
        });
        used = memorySize;
        available = Infinity; // Memory storage has no fixed limit
      }

      return {
        used,
        available,
        type: this.isAvailable ? 'localStorage' : 'memory'
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { used: 0, available: 0, type: 'unknown' };
    }
  }

  // Utility methods for common operations
  async updateUserData(updates) {
    const userData = await this.get('userData') || {};
    const updatedData = { ...userData, ...updates };
    return await this.set('userData', updatedData);
  }

  async addToHistory(entry) {
    const progress = await this.get('progress') || { studyHistory: [] };
    progress.studyHistory = progress.studyHistory || [];
    progress.studyHistory.push({
      ...entry,
      timestamp: new Date().toISOString()
    });

    // Keep only last 100 entries
    if (progress.studyHistory.length > 100) {
      progress.studyHistory = progress.studyHistory.slice(-100);
    }

    return await this.set('progress', progress);
  }

  async getStats() {
    const userData = await this.get('userData') || {};
    const progress = await this.get('progress') || {};

    return {
      totalQuestions: userData.totalQuestions || 0,
      correctAnswers: userData.correctAnswers || 0,
      accuracy: userData.totalQuestions > 0 ?
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0,
      currentStreak: userData.streak || 0,
      studySessions: userData.studySessions || 0,
      level: userData.level || 1,
      xp: userData.xp || 0,
      achievements: userData.achievements || [],
      weakAreas: progress.weakAreas || [],
      masteredTopics: progress.masteredTopics || []
    };
  }

  // Export/Import functionality
  async exportData() {
    try {
      const keys = await this.getAllKeys();
      const exportData = {};

      for (const key of keys) {
        exportData[key] = await this.get(key);
      }

      return {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: exportData
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(importData) {
    try {
      if (!importData.data) {
        throw new Error('Invalid import data format');
      }

      // Clear existing data
      await this.clear();

      // Import new data
      for (const [key, value] of Object.entries(importData.data)) {
        await this.set(key, value);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

// Create global instance
window.Storage = new StorageManager();
