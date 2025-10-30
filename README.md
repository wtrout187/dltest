# 🚗 South Dakota Driver's License Test Prep

> A modern, gamified study app built by Dad for Christian to ace his driver's license test!

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://wtrout187.github.io/dltest/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Made with Love](https://img.sadge/made%20with-❤️-red.svg)](https://github.com/wtrout187/dltest)

## ✨ Features

### 🎮 Gamified Learning
- **XP System**: Earn 10 XP for every correct answer
- **Level Progression**: Automatic level-ups as you gain experience
- **Achievements**: Unlock 25+ badges for milestones
- **Daily Streaks**: Build momentum with consecutive study days
- **Leaderboard Ready**: Track your progress and compete with yourself

### 🧠 Smart Learning
- **Adaptive Questions**: 75+ South Dakota DMV questions
- **Weak Area Detection**: Automatically identifies topics you struggle with
- **Spaced Repetition**: Smart algorithm focuses on what you need
- **Category Coverage**: All 9 SD DMV test categories included
- **Mock Tests**: Full 25-question practice tests

### 📊 Progress Tracking
- **Readiness Score**: Know when you're ready for the real test (aim for 85+)
- **Category Analytics**: Track performance in each topic area
- **Accuracy Metrics**: See your overall and category-specific accuracy
- **Study History**: Review your learning journey

### 📧 Parent Updates
- **Automatic Emails**: Dad gets progress reports automatically
- **Weekly Summaries**: Comprehensive weekly performance updates
- **Achievement Notifications**: Celebrate milestones together
- **Readiness Alerts**: Know when Christian is ready for the test

### 🎨 Modern Design
- **TikTok/Instagram Inspired**: Modern, engaging interface
- **Dark/Light Themes**: Switch between themes instantly
- **Mobile Optimized**: Perfect for Samsung phone and desktop
- **Smooth Animations**: Satisfying visual feedback
- **Haptic Feedback**: Vibration on mobile for achievements

### 📱 Progressive Web App
- **Install on Phone**: Add to home screen like a native app
- **Offline Support**: Study anywhere, even without internet
- **Cross-Device Sync**: Progress syncs via localStorage
- **Fast Loading**: Optimized performance

## 🚀 Quick Start

### For Christian (Using the App)

1. **Visit the App**: [https://wtrout187.github.io/dltest/](https://wtrout187.github.io/dltest/)
2. **Add to Home Screen** (on your phone):
   - **iPhone**: Tap Share → Add to Home Screen
   - **Android**: Tap Menu (⋮) → Add to Home Screen
3. **Start Learning**: Click "Start Learning" and begin studying!

### Study Tips for Success

- 🎯 **Study Daily**: Even 10 minutes keeps your streak alive
- 🔄 **Focus on Weak Areas**: The app highlights what you need to work on
- ⚡ **Take Mock Tests**: Practice the full 25-question format regularly
- 🏆 **Aim for 90%**: Get 90% accuracy consistently before the real test
- 📱 **Use Anywhere**: Study during breaks, lunch, or before bed

## 📖 How It Works

### Study Modes

1. **Study Mode**: Practice with varied questions across all categories
2. **Mock Test**: Take a full 25-question practice test (just like the real DMV test)
3. **Weak Areas**: Focus on topics you're struggling with
4. **Road Signs**: Special practice for South Dakota road signs

### Scoring System

- ✅ **Correct Answer**: +10 XP
- ❌ **Incorrect Answer**: No XP, but you learn!
- 🏆 **Level Up**: Automatic when you reach XP thresholds
- 🔥 **Daily Streak**: Study every day to build your streak
- 📊 **Readiness Score**: Calculated from accuracy, experience, and consistency

### Categories Covered

1. 🚦 Traffic Signs
2. 🚗 Right of Way
3. ⚡ Speed Limits
4. 🅿️ Parking
5. 📋 Driving Laws
6. 🛡️ Safe Driving
7. 🔀 Intersections
8. 🚨 Emergency Vehicles
9. 🛣️ Road Signs

## 🛠️ For Developers

### Local Development

```bash
# Clone the repository
git clone https://github.com/wtrout187/dltest.git
cd dltest

# Serve locally (choose one method)
# Python
python3 -m http.server 8000

# Node.js
npx serve .

# Then open http://localhost:8000
```

### Project Structure

```
dltest/
├── index.html              # Main app entry point
├── css/
│   └── styles.css         # Modern TikTok-inspired styling
├── js/
│   ├── app.js            # Main application controller
│   ├── state.js          # State management with events
│   ├── storage.js        # localStorage wrapper
│   ├── questions.js      # Question management
│   ├── game.js           # Gamification system
│   ├── progress.js       # Progress tracking
│   ├── email.js          # Parent notifications
│   └── ui.js             # UI management
├── data/
│   └── questions.json    # 75 SD DMV questions
├── manifest.json         # PWA configuration
└── sw.js                 # Service worker for offline support
```

### Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with CSS Variables
- **Storage**: localStorage with backup
- **PWA**: Service Workers for offline support
- **Email**: EmailJS integration (configured separately)

### Adding Questions

Questions are stored in `data/questions.json`. Each question has:

```json
{
  "id": 1,
  "category": "traffic-signs",
  "type": "multiple-choice",
  "difficulty": "easy",
  "question": "What does a red octagonal sign mean?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 1,
  "explanation": "Detailed explanation here",
  "reference": "SD Manual Ch.3, P.15",
  "image": null
}
```

## 🔒 Security & Privacy

### Data Privacy
- ✅ **No Server**: All data stored locally on your device
- ✅ **No Tracking**: No analytics or tracking scripts
- ✅ **No Ads**: Completely ad-free experience
- ✅ **No Account Required**: No sign-up or personal data collection
- ✅ **Offline First**: Works without internet connection

### Parent Email Security
- Email notifications use EmailJS (requires configuration)
- Only sends to pre-configured parent email (wtrout@hotmail.com)
- No email data stored in the app
- Optional feature - can be disabled

### Content Security
- All content is static and client-side
- No external API calls (except optional email)
- No user-generated content
- Safe for minors

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ✅ Samsung Internet
- ✅ Mobile browsers

## 🎯 Roadmap

- [x] Core study functionality
- [x] Gamification system
- [x] Progress tracking
- [x] Mock tests
- [x] Weak area detection
- [x] Parent notifications
- [x] PWA support
- [ ] More questions (expand to 150+)
- [ ] Video explanations
- [ ] Voice-over for questions
- [ ] Multiplayer challenges

## 💝 About This Project

This app was built by Wayne Trout for his son Christian, who is preparing for his South Dakota driver's license test. It combines modern web technologies with proven learning techniques to make studying engaging and effective.

### Why This App?

- **Personalized**: Built specifically for Christian's learning style
- **Engaging**: Gamification makes studying fun, not boring
- **Effective**: Smart algorithms focus on what matters
- **Connected**: Dad stays informed of progress
- **Modern**: Looks and feels like apps Christian already loves

## 📄 License

MIT License - feel free to use this for your own family!

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Open an issue or submit a pull request.

## 📞 Support

Questions or issues? Contact Wayne at wtrout@hotmail.com

---

**Made with ❤️ by Dad for Christian**

*Good luck on your test, buddy! You've got this! 🚗💨*

