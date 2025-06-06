// Popup Script for Extension Settings
class ExamLockPopup {
  constructor() {
    this.settings = {
      enabled: true,
      mode: 'overlay',
      maxViolations: 3
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
  }

  async clearViolations() {
    try {
      // Clear session storage on active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          sessionStorage.removeItem('examLockViolated');
          sessionStorage.removeItem('examLockViolations');
          sessionStorage.removeItem('examLockTimestamp');
          localStorage.removeItem('examViolations');
          
          // Remove overlay if present
          const overlay = document.querySelector('.exam-lock-overlay');
          if (overlay) {
            overlay.remove();
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