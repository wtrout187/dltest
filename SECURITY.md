# Security Policy

## 🔒 Security Measures

This application is designed with security and privacy in mind, especially since it's intended for use by a minor.

### Data Privacy

- **No Server-Side Storage**: All data is stored locally on the user's device using localStorage
- **No External Tracking**: No analytics, tracking pixels, or third-party scripts
- **No Personal Data Collection**: The app doesn't collect, store, or transmit personal information
- **Offline-First**: Works completely offline after initial load

### Content Security

- **Static Content Only**: All content is pre-defined and static
- **No User Input Storage**: No user-generated content is stored or transmitted
- **No External Dependencies**: Minimal external resources (only EmailJS for optional parent notifications)
- **XSS Protection**: All user interactions are sanitized

### Email Notifications (Optional Feature)

- Uses EmailJS service for parent notifications
- Only sends to pre-configured email address
- No email data stored in the application
- Can be completely disabled if not needed

### Browser Security

The app implements standard web security practices:

- Content Security Policy headers (when served via GitHub Pages)
- HTTPS only (enforced by GitHub Pages)
- No inline scripts in production
- Secure localStorage usage

## 🛡️ Safe for Minors

This application is specifically designed to be safe for a 15-year-old user:

- ✅ No social features or chat
- ✅ No external links to unsafe content
- ✅ No advertisements
- ✅ No in-app purchases
- ✅ No account creation or passwords
- ✅ No location tracking
- ✅ No camera or microphone access
- ✅ Educational content only

## 🔐 Recommended Usage

### For Parents

1. **Review the Code**: All code is open source and can be reviewed
2. **Local Hosting**: Can be hosted locally for complete control
3. **Monitor Progress**: Email notifications keep you informed
4. **No Surprises**: No hidden features or data collection

### For Users

1. **Use HTTPS**: Always access via https://wtrout187.github.io/dltest/
2. **Keep Browser Updated**: Use the latest version of your browser
3. **Clear Data**: You can clear all app data anytime via browser settings
4. **Report Issues**: Contact parent if anything seems wrong

## 📊 Data Stored Locally

The app stores the following in localStorage (on your device only):

- Study progress (questions answered, accuracy)
- XP and level information
- Daily streak data
- Achievement unlocks
- Theme preference (dark/light mode)
- Last study date

**This data never leaves your device** unless you explicitly use the export feature.

## 🚨 Reporting Security Issues

If you discover a security issue, please email: wtrout@hotmail.com

Please include:
- Description of the issue
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📝 Updates

This security policy was last updated: October 30, 2024

We will update this policy as needed to reflect any changes to the application's security measures.

## ✅ Security Checklist

- [x] No server-side data storage
- [x] No external tracking scripts
- [x] No personal data collection
- [x] HTTPS enforced
- [x] Content Security Policy
- [x] XSS protection
- [x] Safe for minors
- [x] Open source code
- [x] Offline functionality
- [x] Parent monitoring available

---

**Your privacy and security are our top priorities.**
