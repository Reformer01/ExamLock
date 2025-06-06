// Exam Lock Content Script
// Detects page visibility changes and prevents cheating

class ExamLock {
  constructor() {
    this.isLocked = false;
    this.violations = 0;
    this.startTime = Date.now();
    this.settings = {
      mode: 'overlay', // 'overlay' or 'submit'
      maxViolations: 3,
      enabled: true
    };
    
    this.init();
  }

  async init() {
    // Load settings from extension storage
    await this.loadSettings();
    
    // Check if already flagged in session
    this.checkPreviousViolations();
    
    // Set up visibility change listener
    this.setupVisibilityListener();
    
    // Set up form submission detection
    this.setupFormProtection();
    
    // Create overlay element
    this.createOverlay();
    
    console.log('🔒 Exam Lock initialized');
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['examLockSettings']);
      if (result.examLockSettings) {
        this.settings = { ...this.settings, ...result.examLockSettings };
      }
    } catch (error) {
      console.log('Using default settings');
    }
  }

  checkPreviousViolations() {
    const stored = sessionStorage.getItem('examLockViolated');
    if (stored === 'true') {
      this.isLocked = true;
      this.violations = parseInt(sessionStorage.getItem('examLockViolations') || '0');
      if (this.settings.mode === 'overlay') {
        this.showBlockingOverlay();
      }
    }
  }

  setupVisibilityListener() {
    if (!this.settings.enabled) return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleVisibilityViolation();
      }
    });

    // Additional listeners for focus/blur
    window.addEventListener('blur', () => {
      this.handleVisibilityViolation();
    });

    // Prevent common cheating shortcuts
    document.addEventListener('keydown', (e) => {
      // Prevent Alt+Tab, Ctrl+Tab, Win key, F11, etc.
      if (
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.key === 'Tab') ||
        e.key === 'Meta' ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') || // Dev tools
        (e.ctrlKey && e.key === 'U') || // View source
        e.key === 'F12' // Dev tools
      ) {
        e.preventDefault();
        this.handleVisibilityViolation();
      }
    });
  }

  setupFormProtection() {
    // Prevent form submission when locked
    document.addEventListener('submit', (e) => {
      if (this.isLocked && this.settings.mode === 'overlay') {
        e.preventDefault();
        this.showBlockingOverlay();
      }
    });
  }

  handleVisibilityViolation() {
    if (!this.settings.enabled || this.isLocked) return;

    this.violations++;
    const timestamp = new Date().toLocaleTimeString();
    
    console.warn(`⚠️ Exam violation detected! Count: ${this.violations} at ${timestamp}`);
    
    // Store violation in session
    sessionStorage.setItem('examLockViolated', 'true');
    sessionStorage.setItem('examLockViolations', this.violations.toString());
    sessionStorage.setItem('examLockTimestamp', timestamp);

    if (this.settings.mode === 'submit') {
      this.autoSubmitForm();
    } else {
      this.isLocked = true;
      this.showBlockingOverlay();
    }

    // Log violation for monitoring
    this.logViolation();
  }

  autoSubmitForm() {
    console.log('🚨 Auto-submitting form due to cheating detection');
    
    // Look for Google Forms submit button
    const submitButton = document.querySelector('[type="submit"]') || 
                        document.querySelector('[jsname="M2UYVd"]') ||
                        document.querySelector('.appsMaterialWizButtonPaperbuttonContent');
    
    if (submitButton) {
      // Add a warning message
      this.showSubmissionWarning();
      
      // Submit after a brief delay
      setTimeout(() => {
        submitButton.click();
      }, 2000);
    } else {
      // Fallback: try to submit any form
      const forms = document.forms;
      if (forms.length > 0) {
        forms[0].submit();
      }
    }
  }

  showSubmissionWarning() {
    const warning = document.createElement('div');
    warning.className = 'exam-lock-warning';
    warning.innerHTML = `
      <div class="warning-content">
        <div class="warning-icon">⚠️</div>
        <h2>Exam Violation Detected</h2>
        <p>Tab switching detected. Your exam is being automatically submitted.</p>
        <div class="countdown">Submitting in <span id="countdown">3</span> seconds...</div>
      </div>
    `;
    
    document.body.appendChild(warning);
    
    let count = 3;
    const countdownEl = document.getElementById('countdown');
    const interval = setInterval(() => {
      count--;
      if (countdownEl) countdownEl.textContent = count;
      if (count <= 0) clearInterval(interval);
    }, 1000);
  }

  createOverlay() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'exam-lock-overlay';
    this.overlay.innerHTML = `
      <div class="overlay-content">
        <div class="lock-icon">🔒</div>
        <h1>Exam Locked</h1>
        <div class="violation-info">
          <p><strong>Tab switching detected!</strong></p>
          <p>Violations: <span class="violation-count">${this.violations}</span></p>
          <p>Time: <span class="violation-time">${sessionStorage.getItem('examLockTimestamp') || 'N/A'}</span></p>
        </div>
        <div class="warning-message">
          <p>⚠️ <strong>Academic Integrity Violation</strong></p>
          <p>Switching tabs or minimizing the browser during an exam is not permitted.</p>
          <p>Please contact your instructor to continue.</p>
        </div>
        <div class="contact-info">
          <p>Session ID: <code>${this.generateSessionId()}</code></p>
        </div>
      </div>
    `;
  }

  showBlockingOverlay() {
    if (!this.overlay.parentNode) {
      document.body.appendChild(this.overlay);
    }
    this.overlay.style.display = 'flex';
    
    // Update violation count
    const countEl = this.overlay.querySelector('.violation-count');
    if (countEl) countEl.textContent = this.violations;
    
    // Update timestamp
    const timeEl = this.overlay.querySelector('.violation-time');
    if (timeEl) timeEl.textContent = sessionStorage.getItem('examLockTimestamp') || 'N/A';
  }

  generateSessionId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  logViolation() {
    const violationData = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      violations: this.violations,
      sessionDuration: Date.now() - this.startTime
    };
    
    // Store in local storage for monitoring
    const violations = JSON.parse(localStorage.getItem('examViolations') || '[]');
    violations.push(violationData);
    localStorage.setItem('examViolations', JSON.stringify(violations));
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ExamLock();
  });
} else {
  new ExamLock();
}