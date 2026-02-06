// ========================================
// STATE MANAGEMENT
// ========================================
const appState = {
  currentTab: 'home',
  profile: {
    name: 'Alex Morgan',
    headline: 'Senior Product Designer',
    about: 'Passionate about creating user-centered digital experiences that solve complex problems and delight users. With over 5 years of experience, I specialize in mobile design, product strategy, and building accessible interfaces.',
    skills: ['UX Design', 'Product Strategy', 'Mobile Design', 'Figma'],
    experience: [],
    education: [],
    photo: null
  },
  analytics: {
    totalViews: 1247,
    weeklyChange: 23
  }
};

// ========================================
// NAVIGATION
// ========================================
function switchTab(tabName) {
  // Update state
  appState.currentTab = tabName;
  
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  
  // Show selected screen
  const selectedScreen = document.getElementById(`${tabName}Screen`);
  if (selectedScreen) {
    selectedScreen.classList.add('active');
  }
  
  // Update nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  
  const selectedNav = document.querySelector(`[data-tab="${tabName}"]`);
  if (selectedNav) {
    selectedNav.classList.add('active');
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// ========================================
// MODALS
// ========================================
function showQRModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('qrModal');
  
  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.classList.add('overlay-active');
}

function showShareSheet() {
  const overlay = document.getElementById('modalOverlay');
  const sheet = document.getElementById('shareSheet');
  
  overlay.classList.add('active');
  sheet.classList.add('active');
  document.body.classList.add('overlay-active');
}

function showEditModal(section) {
  const modal = document.getElementById('editModal');
  const overlay = document.getElementById('modalOverlay');
  
  overlay.classList.add('active');
  modal.classList.add('active');
  document.body.classList.add('overlay-active');
  
  // Update modal title based on section
  const title = modal.querySelector('.edit-modal__title');
  const sectionNames = {
    'about': 'Edit About',
    'header': 'Edit Profile',
    'skills': 'Edit Skills',
    'experience': 'Add Experience',
    'education': 'Add Education'
  };
  title.textContent = sectionNames[section] || 'Edit';
}

function closeAllModals() {
  const overlay = document.getElementById('modalOverlay');
  const modals = document.querySelectorAll('.modal, .bottom-sheet, .edit-modal');
  
  overlay.classList.remove('active');
  modals.forEach(modal => modal.classList.remove('active'));
  document.body.classList.remove('overlay-active');
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeAllModals);
  }
});

// ========================================
// SETTINGS
// ========================================
function toggleSwitch(element) {
  element.classList.toggle('active');
  // Add haptic feedback simulation
  if (navigator.vibrate) {
    navigator.vibrate(10);
  }
}

function logout() {
  const confirmed = confirm('Are you sure you want to logout?');
  if (confirmed) {
    // Clear data
    localStorage.clear();
    alert('You have been logged out');
    // Could redirect to login page here
  }
}

// ========================================
// SHARE FUNCTIONALITY
// ========================================
function copyLink() {
  const link = 'https://yourprofile.app/@alexmorgan';
  
  // Modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      fallbackCopy(link);
    });
  } else {
    fallbackCopy(link);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showToast('Link copied to clipboard!');
  } catch (err) {
    alert('Failed to copy link');
  }
  
  document.body.removeChild(textarea);
}

function showToast(message) {
  // Create toast element
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: calc(var(--nav-height) + 20px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.9);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Remove after 2 seconds
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// PROFILE EDITING
// ========================================
function saveEdit() {
  const textarea = document.querySelector('#editModal textarea');
  if (textarea) {
    appState.profile.about = textarea.value;
    
    // Update UI
    const aboutElement = document.getElementById('profileAbout');
    if (aboutElement) {
      aboutElement.textContent = textarea.value;
    }
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Show success feedback
    showToast('Profile updated successfully');
  }
  
  closeAllModals();
}

// ========================================
// LOCAL STORAGE
// ========================================
function saveToLocalStorage() {
  try {
    localStorage.setItem('profileData', JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('profileData');
    if (saved) {
      const data = JSON.parse(saved);
      Object.assign(appState, data);
      
      // Update UI with loaded data
      updateUIFromState();
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
}

function updateUIFromState() {
  // Update profile name and headline
  const nameElement = document.getElementById('profileName');
  const headlineElement = document.getElementById('profileHeadline');
  const aboutElement = document.getElementById('profileAbout');
  
  if (nameElement) nameElement.textContent = appState.profile.name;
  if (headlineElement) headlineElement.textContent = appState.profile.headline;
  if (aboutElement) aboutElement.textContent = appState.profile.about;
}

// ========================================
// GREETING
// ========================================
function updateGreeting() {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  }
  
  const welcomeElement = document.querySelector('.home-welcome');
  if (welcomeElement) {
    welcomeElement.textContent = `${greeting}, Alex`;
  }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved data
  loadFromLocalStorage();
  
  // Update greeting
  updateGreeting();
  
  // Set initial tab
  switchTab('home');
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
  
  // Handle character count for textarea
  const textarea = document.querySelector('#editModal textarea');
  if (textarea) {
    textarea.addEventListener('input', (e) => {
      const counter = document.querySelector('.input-counter');
      if (counter) {
        const length = e.target.value.length;
        counter.textContent = `${length}/500`;
        
        // Change color if nearing limit
        if (length > 450) {
          counter.style.color = 'var(--color-warning)';
        } else {
          counter.style.color = 'var(--color-text-tertiary)';
        }
      }
    });
  }
  
  // Prevent zoom on input focus (iOS)
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    });
  });
  
  // Add pull-to-refresh simulation
  let touchStartY = 0;
  let isPulling = false;
  
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      touchStartY = e.touches[0].clientY;
      isPulling = true;
    }
  });
  
  document.addEventListener('touchmove', (e) => {
    if (isPulling && window.scrollY === 0) {
      const touchY = e.touches[0].clientY;
      const pullDistance = touchY - touchStartY;
      
      if (pullDistance > 100) {
        // Trigger refresh
        isPulling = false;
        updateGreeting();
        showToast('Profile refreshed');
      }
    }
  });
  
  document.addEventListener('touchend', () => {
    isPulling = false;
  });
});

// ========================================
// PWA FEATURES
// ========================================
// Check if running as PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Prompt to install PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  // Save the event
  deferredPrompt = e;
  // Optionally show install button
  console.log('PWA install available');
});

// ========================================
// SERVICE WORKER REGISTRATION
// ========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}

// ========================================
// ANALYTICS (Mock)
// ========================================
function trackPageView(page) {
  console.log(`Page viewed: ${page}`);
  // Here you would send to analytics service
}

// Track tab switches
const originalSwitchTab = switchTab;
switchTab = function(tabName) {
  trackPageView(tabName);
  originalSwitchTab(tabName);
};

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ========================================
// EXPORT FOR TESTING
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    switchTab,
    showQRModal,
    showShareSheet,
    copyLink,
    saveEdit,
    appState
  };
}
