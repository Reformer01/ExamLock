# ExamLock: Enhanced Academic Integrity Protection

A Chrome extension that detects tab switching and other cheating behaviors during online exams, with enhanced penalty features and refresh protection.

## 🆕 New Features

### Delayed Timer Penalty
- **Graduated Penalty System**: When students switch tabs, they now see a countdown timer overlay that prevents them from continuing the exam for a specified duration
- **Configurable Duration**: Admins can set the delay penalty duration (5-300 seconds) through the extension settings
- **Visual Countdown**: Students see a prominent timer showing exactly how long they must wait
- **Progressive Enforcement**: Provides a warning penalty before applying the final blocking overlay or auto-submission

### Enhanced Refresh Protection
- **Persistent Violations**: Blocking overlays now persist through page refreshes - students cannot bypass penalties by refreshing the page
- **State Recovery**: The extension remembers violation states and active penalties across page reloads
- **Tamper Resistance**: Uses both sessionStorage and localStorage to maintain violation tracking

## 🔧 Features

### Core Protection
- **Tab Switch Detection**: Monitors when students switch away from the exam tab
- **Keyboard Shortcut Prevention**: Blocks common cheating shortcuts (Alt+Tab, Ctrl+Tab, F11, F12, etc.)
- **Focus Loss Detection**: Detects when the exam window loses focus
- **Form Submission Protection**: Prevents form submission when violations are detected

### Response Modes
1. **Blocking Overlay Mode**: Shows a permanent blocking screen after violations
2. **Auto-Submit Mode**: Automatically submits the exam form after violations
3. **Delay Penalty Mode**: Shows countdown timer before applying main penalty (NEW)

### Admin Controls
- **Enable/Disable Protection**: Toggle the entire protection system
- **Response Mode Selection**: Choose between overlay, auto-submit, or delay penalty
- **Max Violations Setting**: Configure how many violations trigger the penalty
- **Delay Penalty Duration**: Set countdown timer duration (5-300 seconds)
- **Violation Clearing**: Admin can clear violations for legitimate cases

## 🎯 Supported Platforms

- Google Forms (`docs.google.com/forms`)
- Google Forms short links (`forms.gle`)
- Local development servers (`localhost`, `127.0.0.1`)
- Local HTML files (`file://`)

## 📦 Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The ExamLock icon should appear in your extensions toolbar

## ⚙️ Configuration

Click the ExamLock extension icon to access settings:

### Basic Settings
- **Enable Protection**: Turn the extension on/off
- **Response Mode**: Choose how violations are handled
- **Max Violations**: Set violation threshold (1-10)

### Delay Penalty Settings (NEW)
- **Enable Delay Penalty**: Toggle the countdown timer feature
- **Delay Duration**: Set how long students must wait (5-300 seconds)

### Admin Actions
- **Save Settings**: Apply configuration changes
- **Clear Violations**: Reset violation state for current tab

## 🧪 Testing

Use the included `demo.html` file to test the extension:

1. Open `demo.html` in Chrome
2. Ensure the extension is enabled
3. Try the test buttons to simulate violations:
   - **Simulate Tab Switch**: Triggers visibility change detection
   - **Simulate Keyboard Shortcut**: Tests shortcut prevention
   - **Test Refresh Protection**: Demonstrates persistence across refreshes

## 🔒 How It Works

### Violation Detection
1. **Visibility API**: Monitors `document.visibilitychange` events
2. **Focus Events**: Listens for window `blur` events
3. **Keyboard Events**: Intercepts prohibited key combinations
4. **Real-time Monitoring**: Continuous background monitoring during exam sessions

### Penalty Application
1. **First Violation**: Shows delay penalty overlay with countdown timer
2. **Countdown Period**: Students cannot interact with exam during timer
3. **Timer Completion**: 
   - If under max violations: Timer disappears, exam continues
   - If at max violations: Applies final penalty (blocking overlay or auto-submit)
4. **Refresh Protection**: All states persist through page refreshes

### Data Storage
- **Session Storage**: Temporary violation data for current session
- **Local Storage**: Persistent data for refresh protection
- **Chrome Storage**: Extension settings and configuration

## 🛡️ Security Features

### Tamper Resistance
- **High Z-Index Overlays**: Overlays appear above all page content
- **Pointer Events Blocking**: Prevents interaction with underlying content
- **User Selection Disabled**: Prevents text selection on overlays
- **Refresh Persistence**: Violations survive page reloads

### Privacy Protection
- **Local Data Only**: All violation data stored locally
- **No External Transmission**: No data sent to external servers
- **Session-Based Tracking**: Violation data cleared when browser closes

## 📊 Violation Logging

The extension logs detailed violation information:

```javascript
{
  timestamp: 1640995200000,
  url: "https://docs.google.com/forms/d/abc123/viewform",
  userAgent: "Mozilla/5.0...",
  violations: 2,
  sessionDuration: 300000
}
```

## 🎨 UI Components

### Delay Penalty Overlay
- **Orange Theme**: Distinguishes from blocking overlay
- **Large Timer Display**: Prominent countdown in MM:SS format
- **Violation Information**: Shows current violation count and timestamp
- **Warning Message**: Explains the penalty and consequences

### Blocking Overlay
- **Red Theme**: Indicates final penalty state
- **Lock Icon**: Visual indicator of locked state
- **Session ID**: Unique identifier for support purposes
- **Contact Information**: Instructions for students

## 🔧 Development

### File Structure
```
ExamLock/
├── manifest.json          # Extension configuration
├── content.js            # Main content script with violation detection
├── overlay.css           # Overlay styling (blocking + delay penalty)
├── popup.html            # Settings interface
├── popup.js              # Settings logic
├── popup.css             # Settings styling
├── demo.html             # Testing page
└── icons/                # Extension icons
```

### Key Classes
- **ExamLock**: Main content script class
- **ExamLockPopup**: Settings interface class

### Extension APIs Used
- **Chrome Storage API**: Settings persistence
- **Chrome Scripting API**: Violation clearing
- **Chrome Tabs API**: Active tab detection

## 🐛 Troubleshooting

### Common Issues

**Extension not working on local files:**
- Ensure "Allow access to file URLs" is enabled in extension settings

**Settings not saving:**
- Check Chrome storage permissions
- Verify extension has proper permissions

**Overlays not appearing:**
- Check browser console for JavaScript errors
- Verify content script injection

**Violations not persisting through refresh:**
- Check localStorage permissions
- Verify beforeunload event handling

### Debug Mode
Enable Chrome DevTools console to see violation logs:
```
🔒 Exam Lock initialized
⚠️ Exam violation detected! Count: 1 at 10:30:45 AM
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with demo.html
5. Submit a pull request

## 📞 Support

For technical support or feature requests, please create an issue in the repository.

---

**⚠️ Important**: This extension is designed for educational integrity purposes. Ensure compliance with your institution's policies and local regulations when deploying in academic environments.
