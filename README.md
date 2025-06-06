# Exam Lock Chrome Extension

A Chrome Extension designed to maintain academic integrity during online examinations by detecting and preventing tab switching, minimizing, and other potential cheating behaviors.

## Features

- **Page Visibility Detection**: Uses the Page Visibility API to detect tab switches and window minimization
- **Keyboard Shortcut Prevention**: Blocks common cheating shortcuts (Alt+Tab, F12, Ctrl+U, etc.)
- **Dual Response Modes**: 
  - **Overlay Mode**: Shows a blocking overlay that prevents further interaction
  - **Auto-Submit Mode**: Automatically submits the form when violations are detected
- **Violation Logging**: Records all violations with timestamps for review
- **Session Persistence**: Maintains violation state across page refreshes
- **Google Forms Integration**: Specifically designed to work with Google Forms and other exam platforms

## Installation

### For Development/Testing

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension should now appear in your Chrome toolbar

### For Production Deployment

1. Package the extension files into a ZIP archive
2. Upload to the Chrome Web Store Developer Dashboard
3. Follow Chrome Web Store review process
4. Deploy to users via Chrome Web Store or Enterprise policies

## File Structure

```
exam-lock-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── overlay.css           # Styles for blocking overlay
├── popup.html           # Extension popup interface
├── popup.css            # Popup styles
├── popup.js             # Popup functionality
├── demo.html            # Demo page for testing
└── README.md            # This file
```

## Configuration

### Manifest Configuration

The extension can be configured to work with different URL patterns by modifying the `content_scripts.matches` array in `manifest.json`:

```json
"matches": [
  "https://docs.google.com/forms/d/*/viewform*",
  "https://forms.gle/*",
  "*://localhost:*/*",
  "*://127.0.0.1:*/*"
]
```

### Settings

Users can configure the extension through the popup interface:

- **Enable/Disable Protection**: Toggle the monitoring on/off
- **Response Mode**: Choose between overlay blocking or auto-submission
- **Max Violations**: Set the threshold for violation tracking

## How It Works

### Detection Methods

1. **Page Visibility API**: Monitors `document.visibilitychange` events
2. **Window Focus Events**: Listens for `window.blur` events
3. **Keyboard Shortcuts**: Intercepts and blocks prohibited key combinations
4. **Form Protection**: Prevents form submission when violations are detected

### Response Actions

#### Overlay Mode
- Creates a full-screen blocking overlay
- Displays violation information and warning messages
- Prevents further interaction with the exam
- Persists across page refreshes

#### Auto-Submit Mode
- Automatically submits the form when violations are detected
- Shows a countdown warning before submission
- Works with Google Forms and custom form elements

### Violation Logging

All violations are logged with:
- Timestamp
- URL of the exam page
- User agent information
- Total violation count
- Session duration

## Testing

Use the included `demo.html` file to test the extension functionality:

1. Load the extension in Chrome
2. Open `demo.html` in your browser
3. Try switching tabs, minimizing windows, or pressing blocked shortcuts
4. Observe the violation detection and logging

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Compatible with Chromium-based versions
- **Firefox**: Would require adaptation to Manifest V2
- **Safari**: Not supported

## Security Considerations

### What This Extension Can Do

- Detect tab switches and window minimization
- Block keyboard shortcuts within the page context
- Log user behavior for academic integrity monitoring
- Prevent form submission in violation scenarios

### What This Extension Cannot Do

- Prevent users from using other devices
- Block system-level shortcuts (Windows key, etc.)
- Prevent physical screen sharing or photography
- Monitor activity outside the browser
- Access content from other tabs or windows

## Privacy

The extension:
- Only activates on specified exam URLs
- Stores violation logs locally in the browser
- Does not transmit data to external servers
- Respects user privacy outside of exam contexts

## Troubleshooting

### Common Issues

1. **Extension not working on exam page**
   - Check that the URL pattern matches in `manifest.json`
   - Ensure the extension is enabled and has necessary permissions

2. **Violations not being detected**
   - Verify that JavaScript is enabled
   - Check browser console for error messages
   - Ensure the page has loaded completely

3. **Overlay not appearing**
   - Check for CSS conflicts with the exam platform
   - Verify that the overlay CSS is loading correctly

### Debug Mode

To enable debug logging, open the browser console and look for messages prefixed with `🔒 Exam Lock`.

## Development

### Setup

1. Clone the repository
2. Make your changes to the source files
3. Test using the demo page
4. Load the unpacked extension in Chrome for testing

### Building for Production

1. Update version number in `manifest.json`
2. Test thoroughly with real exam platforms
3. Package files into ZIP archive for distribution
4. Submit to Chrome Web Store if needed

## License

This project is provided for educational purposes. Please ensure compliance with your institution's policies and local regulations when deploying.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions:
- Check the troubleshooting section above
- Review browser console for error messages
- Test with the included demo page
- Ensure all files are properly loaded