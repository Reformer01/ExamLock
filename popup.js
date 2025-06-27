// Popup Script for Extension Settings
class ExamLockPopup {
  constructor() {
    this.settings = {
      enabled: true,
      mode: 'overlay',
      maxViolations: 3,
      delayPenalty: 30,
      delayPenaltyEnabled: true
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['examLockSettings']);
      if (result.examLockSettings) {
        this.settings = { ...this.settings, ...result.examLockSettings };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({ examLockSettings: this.settings });
      this.showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Error saving settings', 'error');
    }
  }

  setupEventListeners() {
    // Enable/disable toggle
    const enabledToggle = document.getElementById('enabledToggle');
    enabledToggle.addEventListener('change', (e) => {
      this.settings.enabled = e.target.checked;
    });

    // Mode selection
    const modeSelect = document.getElementById('modeSelect');
    modeSelect.addEventListener('change', (e) => {
      this.settings.mode = e.target.value;
    });

    // Max violations
    const maxViolations = document.getElementById('maxViolations');
    maxViolations.addEventListener('change', (e) => {
      this.settings.maxViolations = parseInt(e.target.value);
    });

    // Delay penalty toggle
    const delayPenaltyToggle = document.getElementById('delayPenaltyToggle');
    delayPenaltyToggle.addEventListener('change', (e) => {
      this.settings.delayPenaltyEnabled = e.target.checked;
      this.updateDelayPenaltyVisibility();
    });

    // Delay penalty duration
    const delayPenalty = document.getElementById('delayPenalty');
    delayPenalty.addEventListener('change', (e) => {
      this.settings.delayPenalty = parseInt(e.target.value);
    });

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
      this.saveSettings();
    });

    // Clear violations button
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', () => {
      this.clearViolations();
    });
  }

  updateUI() {
    document.getElementById('enabledToggle').checked = this.settings.enabled;
    document.getElementById('modeSelect').value = this.settings.mode;
    document.getElementById('maxViolations').value = this.settings.maxViolations;
    document.getElementById('delayPenaltyToggle').checked = this.settings.delayPenaltyEnabled;
    document.getElementById('delayPenalty').value = this.settings.delayPenalty;
    
    this.updateDelayPenaltyVisibility();
  }

  updateDelayPenaltyVisibility() {
    const delayPenaltySettings = document.getElementById('delayPenaltySettings');
    const delayPenaltyEnabled = document.getElementById('delayPenaltyToggle').checked;
    
    if (delayPenaltyEnabled) {
      delayPenaltySettings.style.display = 'block';
      delayPenaltySettings.style.opacity = '1';
    } else {
      delayPenaltySettings.style.opacity = '0.5';
      delayPenaltySettings.style.pointerEvents = 'none';
    }
  }

  async clearViolations() {
    try {
      // Clear session storage on active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Clear session storage
          sessionStorage.removeItem('examLockViolated');
          sessionStorage.removeItem('examLockViolations');
          sessionStorage.removeItem('examLockTimestamp');
          sessionStorage.removeItem('examLockDelayEndTime');
          
          // Clear local storage
          localStorage.removeItem('examViolations');
          localStorage.removeItem('examLockRefreshAttempt');
          localStorage.removeItem('examLockViolations');
          localStorage.removeItem('examLockTimestamp');
          localStorage.removeItem('examLockDelayEndTime');
          
          // Remove overlays if present
          const overlay = document.querySelector('.exam-lock-overlay');
          if (overlay) {
            overlay.remove();
          }
          
          const delayOverlay = document.querySelector('.exam-lock-delay-overlay');
          if (delayOverlay) {
            delayOverlay.remove();
          }
          
          const warning = document.querySelector('.exam-lock-warning');
          if (warning) {
            warning.remove();
          }
        }
      });

      this.showStatus('Violations cleared successfully!', 'success');
    } catch (error) {
      console.error('Error clearing violations:', error);
      this.showStatus('Error clearing violations', 'error');
    }
  }

  showStatus(message, type) {
    const statusDiv = document.getElementById('statusDiv');
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExamLockPopup();
});
