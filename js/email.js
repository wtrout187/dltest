// Email Notification System using EmailJS
class EmailNotificationSystem {
  constructor() {
    this.isInitialized = false;
    this.parentEmail = 'wtrout@hotmail.com';
    this.serviceId = 'service_dltest'; // Would be configured in EmailJS
    this.templateIds = {
      testResult: 'template_test_result',
      weeklyReport: 'template_weekly_report',
      achievement: 'template_achievement',
      readinessAlert: 'tempe_readiness'
    };
    this.publicKey = 'your_emailjs_public_key'; // Would be configured
  }

  async init() {
    if (this.isInitialized) return;

    console.log('📧 Initializing email notification system...');

    try {
      // In a real implementation, you would load EmailJS
      // For now, we'll simulate the functionality
      this.isInitialized = true;
      console.log('✅ Email system initialized (simulation mode)');
    } catch (error) {
      console.warn('Email system initialization failed:', error);
    }
  }

  // Send test result notification
  async sendTestResult(testData) {
    if (!this.isInitialized) {
      console.log('📧 Email system not initialized, skipping notification');
      return false;
    }

    const userData = window.State?.getUserData();
    if (!userData) return false;

    const emailData = {
      to_email: this.parentEmail,
      student_name: userData.name,
      test_type: testData.type || 'Practice Test',
      score: testData.score || 0,
      total_questions: testData.totalQuestions || 0,
      correct_answers: testData.correctAnswers || 0,
      accuracy: testData.accuracy || 0,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      readiness_score: window.State?.getProgress().readinessScore || 0
    };

    return await this.sendEmail('testResult', emailData);
  }

  // Send weekly progress report
  async sendWeeklyReport() {
    if (!this.isInitialized) {
      console.log('📧 Email system not initialized, skipping weekly report');
      return false;
    }

    const userData = window.State?.getUserData();
    const progress = window.State?.getProgress();

    if (!userData || !progress) return false;

    // Calculate weekly stats (simplified - in real app would track actual weekly data)
    const weeklyStats = {
      questionsThisWeek: Math.min(userData.totalQuestions, 50), // Simulate weekly count
      accuracyThisWeek: userData.totalQuestions > 0 ?
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0,
      studySessionsThisWeek: Math.min(userData.studySessions, 7),
      currentStreak: userData.streak,
      improvementAreas: progress.weakAreas.join(', ') || 'None',
      masteredTopics: progress.masteredTopics.join(', ') || 'None'
    };

    const emailData = {
      to_email: this.parentEmail,
      student_name: userData.name,
      week_ending: new Date().toLocaleDateString(),
      questions_practiced: weeklyStats.questionsThisWeek,
      weekly_accuracy: weeklyStats.accuracyThisWeek,
      study_sessions: weeklyStats.studySessionsThisWeek,
      current_streak: weeklyStats.currentStreak,
      readiness_score: progress.readinessScore,
      improvement_areas: weeklyStats.improvementAreas,
      mastered_topics: weeklyStats.masteredTopics,
      total_questions: userData.totalQuestions,
      overall_accuracy: userData.totalQuestions > 0 ?
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0,
      current_level: userData.level,
      total_xp: userData.xp
    };

    return await this.sendEmail('weeklyReport', emailData);
  }

  // Send achievement notification
  async sendAchievementNotification(userData, achievement) {
    if (!this.isInitialized) {
      console.log('📧 Email system not initialized, skipping achievement notification');
      return false;
    }

    const emailData = {
      to_email: this.parentEmail,
      student_name: userData.name,
      achievement_name: achievement.name,
      achievement_description: achievement.description,
      achievement_icon: achievement.icon,
      xp_reward: achievement.xpReward,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      current_level: userData.level,
      total_xp: userData.xp,
      total_achievements: userData.achievements.length
    };

    return await this.sendEmail('achievement', emailData);
  }

  // Send readiness alert when student is ready for test
  async sendReadinessAlert() {
    if (!this.isInitialized) {
      console.log('📧 Email system not initialized, skipping readiness alert');
      return false;
    }

    const userData = window.State?.getUserData();
    const progress = window.State?.getProgress();

    if (!userData || !progress || progress.readinessScore < 85) return false;

    const emailData = {
      to_email: this.parentEmail,
      student_name: userData.name,
      readiness_score: progress.readinessScore,
      total_questions: userData.totalQuestions,
      overall_accuracy: userData.totalQuestions > 0 ?
        Math.round((userData.correctAnswers / userData.totalQuestions) * 100) : 0,
      current_streak: userData.streak,
      mastered_topics: progress.masteredTopics.length,
      weak_areas: progress.weakAreas.length,
      date: new Date().toLocaleDateString(),
      recommendation: 'Christian appears ready to take the official driver\'s license test!'
    };

    return await this.sendEmail('readinessAlert', emailData);
  }

  // Generic email sending method
  async sendEmail(templateType, data) {
    try {
      console.log(`📧 Sending ${templateType} email to ${this.parentEmail}`);
      console.log('Email data:', data);

      // In a real implementation, this would use EmailJS:
      /*
      const result = await emailjs.send(
        this.serviceId,
        this.templateIds[templateType],
        data,
        this.publicKey
      );
      */

      // Simulate successful email sending
      const result = {
        status: 200,
        text: 'Email sent successfully (simulated)'
      };

      console.log('✅ Email sent successfully:', result);

      // Show notification to user
      this.showEmailNotification(templateType, true);

      return true;

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      this.showEmailNotification(templateType, false);
      return false;
    }
  }

  // Show notification to user about email status
  showEmailNotification(templateType, success) {
    const messages = {
      testResult: success ?
        'Test results sent to parent!' :
        'Failed to send test results',
      weeklyReport: success ?
        'Weekly report sent to parent!' :
        'Failed to send weekly report',
      achievement: success ?
        'Achievement notification sent to parent!' :
        'Failed to send achievement notification',
      readinessAlert: success ?
        'Readiness alert sent to parent!' :
        'Failed to send readiness alert'
    };

    if (window.app) {
      window.app.showNotification(
        messages[templateType] || 'Email notification processed',
        success ? 'success' : 'error'
      );
    }
  }

  // Schedule weekly reports
  scheduleWeeklyReports() {
    // Send weekly report every Sunday at 6 PM
    const now = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(now.getDate() + (7 - now.getDay()));
    nextSunday.setHours(18, 0, 0, 0);

    const timeUntilNextSunday = nextSunday.getTime() - now.getTime();

    setTimeout(() => {
      this.sendWeeklyReport();

      // Schedule recurring weekly reports
      setInterval(() => {
        this.sendWeeklyReport();
      }, 7 * 24 * 60 * 60 * 1000); // Every week

    }, timeUntilNextSunday);

    console.log(`📅 Weekly reports scheduled for Sundays at 6 PM. Next report: ${nextSunday.toLocaleString()}`);
  }

  // Check if readiness alert should be sent
  checkReadinessAlert() {
    const progress = window.State?.getProgress();
    if (!progress) return;

    // Send alert when readiness score reaches 85% for the first time
    const lastAlertScore = localStorage.getItem('dltest_last_readiness_alert');

    if (progress.readinessScore >= 85 && (!lastAlertScore || parseInt(lastAlertScore) < 85)) {
      this.sendReadinessAlert();
      localStorage.setItem('dltest_last_readiness_alert', progress.readinessScore.toString());
    }
  }

  // Update parent email address
  updateParentEmail(newEmail) {
    if (this.isValidEmail(newEmail)) {
      this.parentEmail = newEmail;

      // Save to storage
      if (window.Storage) {
        window.Storage.updateUserData({
          preferences: { parentEmail: newEmail }
        });
      }

      console.log(`📧 Parent email updated to: ${newEmail}`);
      return true;
    }

    console.error('❌ Invalid email address:', newEmail);
    return false;
  }

  // Validate email address
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get email templates (for customization)
  getEmailTemplates() {
    return {
      testResult: {
        subject: '🚗 {{student_name}} - Driver\'s Test Practice Results',
        body: `
Hi there!

{{student_name}} just completed a {{test_type}} with the following results:

📊 Test Results:
• Score: {{correct_answers}}/{{total_questions}} ({{accuracy}}%)
• Date: {{date}} at {{time}}
• Current Readiness Score: {{readiness_score}}/100

{{student_name}} is making great progress with their driver's license preparation!

Best regards,
SD Driver's License Test Prep App
        `
      },

      weeklyReport: {
        subject: '📈 {{student_name}} - Weekly Progress Report',
        body: `
Hi there!

Here's {{student_name}}'s weekly progress report for the week ending {{week_ending}}:

📊 This Week's Activity:
• Questions Practiced: {{questions_practiced}}
• Weekly Accuracy: {{weekly_accuracy}}%
• Study Sessions: {{study_sessions}}
• Current Streak: {{current_streak}} days 🔥

🎯 Overall Progress:
• Total Questions: {{total_questions}}
• Overall Accuracy: {{overall_accuracy}}%
• Current Level: {{current_level}}
• Total XP: {{total_xp}}
• Readiness Score: {{readiness_score}}/100

📚 Areas for Improvement: {{improvement_areas}}
🏆 Mastered Topics: {{mastered_topics}}

Keep up the great work!

Best regards,
SD Driver's License Test Prep App
        `
      },

      achievement: {
        subject: '🏆 {{student_name}} - New Achievement Unlocked!',
        body: `
Hi there!

Great news! {{student_name}} just unlocked a new achievement:

🏆 {{achievement_name}} {{achievement_icon}}
{{achievement_description}}

Reward: +{{xp_reward}} XP

📊 Current Stats:
• Level: {{current_level}}
• Total XP: {{total_xp}}
• Total Achievements: {{total_achievements}}

{{student_name}} is doing fantastic with their driver's license preparation!

Best regards,
SD Driver's License Test Prep App
        `
      },

      readinessAlert: {
        subject: '🎉 {{student_name}} - Ready for the Driver\'s Test!',
        body: `
Hi there!

Exciting news! {{student_name}} has reached a readiness score of {{readiness_score}}/100 and appears ready to take the official driver's license test!

📊 Current Stats:
• Readiness Score: {{readiness_score}}/100
• Total Questions Practiced: {{total_questions}}
• Overall Accuracy: {{overall_accuracy}}%
• Current Streak: {{current_streak}} days
• Mastered Topics: {{mastered_topics}}
• Areas Still Improving: {{weak_areas}}

{{recommendation}}

Consider scheduling the official test when convenient.

Best regards,
SD Driver's License Test Prep App
        `
      }
    };
  }

  // Test email functionality
  async testEmail() {
    const testData = {
      type: 'Test Email',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      accuracy: 85
    };

    return await this.sendTestResult(testData);
  }
}

// Create global instance
window.Email = new EmailNotificationSystem();
