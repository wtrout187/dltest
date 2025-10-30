# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. Buttons Not Working / Nothing Happens When Clicking

**Symptoms:**
- Clicking "Study Mode", "Mock Test", or other buttons does nothing
- No questions appear
- App seems frozen

**Solutions:**

#### Solution A: Hard Refresh the Page
1. **Windows/Linux**: Press `Ctrl + Shift + R`
2. **Mac**: Press `Cmd + Shift + R`
3. **Mobile**: Close the browser tab completely and reopen

#### Solution B: Clear Browser Cache
1. Open browser settings
2. Go to Privacy & Security
3. Click "Clear browsing data"
4. Select "Cached images and files"
5. Click "Clear data"
6. Refresh the page

#### Solution C: Check Browser Console
1. Press `F12` to open Developer Tools
2. Click on the "Console" tab
3. Look for any red error messages
4. Take a screenshot and send to Dad

#### Solution D: Skip Welcome Screen (Debug Mode)
1. Press `F12` to open console
2. Type: `skipWelcome()` and press Enter
3. The app should now load

#### Solution E: Use Direct Link
Try accessing: `https://wtrout187.github.io/dltest/?skip=1`

---

### 2. Welcome Screen Won't Go Away

**Symptoms:**
- Stuck on the welcome screen
- "Start Learning" button doesn't work

**Solutions:**

1. **Quick Fix**: Add `?skip=1` to the URL
   - Go to: `https://wtrout187.github.io/dltest/?skip=1`

2. **Console Fix**:
   - Press `F12`
   - Type: `skipWelcome()`
   - Press Enter

3. **Clear Local Storage**:
   - Press `F12`
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Find "Local Storage"
   - Delete all `dltest_` entries
   - Refresh the page

---

### 3. Progress Not Saving

**Symptoms:**
- XP and level reset when refreshing
- Questions answered don't count
- Streak resets

**Solutions:**

1. **Check Browser Settings**:
   - Make sure cookies/local storage is enabled
   - Don't use Private/Incognito mode
   - Check if browser is set to clear data on exit

2. **Export Your Data** (Backup):
   - Click Settings (⚙️)
   - Click "Export Data"
   - Save the JSON file
   - You can import it later if needed

3. **Try Different Browser**:
   - Chrome (recommended)
   - Firefox
   - Safari
   - Edge

---

### 4. Questions Not Loading

**Symptoms:**
- "Loading question..." message stays
- Blank question screen
- No answer options

**Solutions:**

1. **Check Questions Loaded**:
   - Press `F12`
   - Type: `debugApp()`
   - Look for "Questions loaded: 40"
   - If it shows 0, there's a loading issue

2. **Force Reload Questions**:
   - Press `F12`
   - Type: `window.Questions.loadQuestions()`
   - Then type: `window.Questions.startStudySession()`

3. **Check Internet Connection**:
   - Make sure you're online
   - Try refreshing the page

---

### 5. Theme Toggle Not Working

**Symptoms:**
- Can't switch between dark/light mode
- Theme button doesn't respond

**Solutions:**

1. **Manual Theme Switch**:
   - Press `F12`
   - Type: `window.UI.toggleTheme()`

2. **Reset Theme**:
   - Press `F12`
   - Type: `localStorage.removeItem('dltest_theme')`
   - Refresh the page

---

### 6. Settings or Help Buttons Don't Work

**Symptoms:**
- Clicking ⚙️ or ❓ does nothing
- No modal appears

**Solutions:**

1. **Manual Open Settings**:
   - Press `F12`
   - Type: `window.UI.showSettings()`

2. **Manual Open Help**:
   - Press `F12`
   - Type: `window.app.showInstructions()`

---

### 7. Mobile Issues

**Symptoms:**
- App doesn't work on phone
- Buttons too small
- Layout broken

**Solutions:**

1. **Use Supported Browser**:
   - iOS: Safari or Chrome
   - Android: Chrome or Firefox

2. **Clear Mobile Browser Cache**:
   - iOS Safari: Settings → Safari → Clear History and Website Data
   - Android Chrome: Settings → Privacy → Clear browsing data

3. **Try Desktop Mode**:
   - In mobile browser, request "Desktop Site"

4. **Install as App**:
   - iOS: Share → Add to Home Screen
   - Android: Menu → Add to Home screen

---

### 8. Scoring Not Working

**Symptoms:**
- XP not increasing
- Level not going up
- Correct answers not counted

**Solutions:**

1. **Test Scoring System**:
   - Press `F12`
   - Type: `testScoring()`
   - Check if XP increases

2. **Check State**:
   - Press `F12`
   - Type: `debugApp()`
   - Look at the user data

3. **Manual Fix**:
   - Press `F12`
   - Type: `window.State.answerQuestion(true, 'traffic-signs')`
   - This should add XP

---

## Debug Commands

Open browser console (`F12`) and try these commands:

### Check App Status
```javascript
debugApp()
```
Shows current state of the app

### Skip Welcome Screen
```javascript
skipWelcome()
```
Bypasses the welcome screen

### Test Scoring
```javascript
testScoring()
```
Simulates answering questions

### Start Study Mode Manually
```javascript
window.app.startStudyMode()
```
Forces study mode to start

### Check Questions
```javascript
console.log(window.Questions.questions.length)
```
Shows how many questions are loaded

### Reset Everything
```javascript
localStorage.clear()
location.reload()
```
⚠️ WARNING: This deletes all progress!

---

## Browser Compatibility

### ✅ Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### ⚠️ Limited Support
- Internet Explorer (not recommended)
- Older mobile browsers

### 📱 Mobile
- iOS Safari 14+
- Chrome Mobile 90+
- Firefox Mobile 88+

---

## Still Having Issues?

### Contact Dad
- Email: **wtrout@hotmail.com**
- Include:
  1. What you were trying to do
  2. What happened instead
  3. Screenshot of any error messages
  4. Browser and device you're using

### Provide Debug Info
1. Press `F12`
2. Type: `debugApp()`
3. Take a screenshot of the console output
4. Send to Dad

---

## Emergency Reset

If nothing else works:

1. Press `F12`
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Find "Local Storage" → `https://wtrout187.github.io`
4. Click "Clear All"
5. Close browser completely
6. Reopen and go to: `https://wtrout187.github.io/dltest/?skip=1`

⚠️ **Warning**: This will delete all your progress!

---

## Performance Tips

### For Best Performance:
1. Use Chrome or Firefox
2. Close other tabs
3. Make sure you have good internet
4. Don't use Private/Incognito mode
5. Keep browser updated

### If App is Slow:
1. Clear browser cache
2. Restart browser
3. Try different browser
4. Check internet speed

---

## Known Issues

### Issue: Welcome screen appears every time
**Status**: Fixed in latest version
**Workaround**: Use `?skip=1` in URL

### Issue: Progress resets on mobile
**Status**: Investigating
**Workaround**: Export data regularly, use desktop version

---

Last Updated: January 2025
