// Night Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create the night mode toggle button
    createNightModeToggle();
    
    // Initialize proper night mode class
    initializeNightMode();
    
    // Add a custom event that can be triggered when night mode changes
    const nightModeEvent = new CustomEvent('nightModeChanged');
});

// Apply night mode preference immediately - before DOM content loads
// This prevents the animation from running when loading pages
(function() {
    const isDarkMode = localStorage.getItem('nightMode') === 'true';
    if (isDarkMode) {
        document.documentElement.classList.add('preload-night-mode');
    }
})();

// Create night mode toggle button
function createNightModeToggle() {
    // Create the button element
    const nightModeBtn = document.createElement('button');
    nightModeBtn.id = 'nightModeToggle';
    nightModeBtn.title = 'Toggle Night Mode';
    
    // Set the styles directly as specified
    nightModeBtn.style.position = 'fixed';
    nightModeBtn.style.bottom = '20px';
    nightModeBtn.style.right = '20px';
    nightModeBtn.style.zIndex = '9999';
    nightModeBtn.style.background = 'rgba(0,0,0,0.5)';
    nightModeBtn.style.color = 'white';
    nightModeBtn.style.border = 'none';
    nightModeBtn.style.borderRadius = '8px';
    nightModeBtn.style.padding = '10px 15px';
    nightModeBtn.style.cursor = 'pointer';
    nightModeBtn.style.fontSize = '14px';
    
    // Add it to the body
    document.body.appendChild(nightModeBtn);
    
    // Update button appearance based on current mode
    const isDarkMode = localStorage.getItem('nightMode') === 'true';
    updateNightModeButton(isDarkMode);
    
    // Add click event
    nightModeBtn.addEventListener('click', toggleNightMode);
}

// Initialize night mode based on saved preference
function initializeNightMode() {
    const isDarkMode = localStorage.getItem('nightMode') === 'true';
    
    // Remove preload class and add regular night mode class if needed
    document.documentElement.classList.remove('preload-night-mode');
    
    if (isDarkMode) {
        document.body.classList.add('night-mode');
    }
    
    // Apply fix for music button if it exists
    setTimeout(fixMusicButtonStyles, 100);
}

// Toggle night mode on/off
function toggleNightMode() {
    const isDarkMode = document.body.classList.contains('night-mode');
    
    if (isDarkMode) {
        // Switch to light mode
        document.body.classList.remove('night-mode');
        localStorage.setItem('nightMode', 'false');
        updateNightModeButton(false);
    } else {
        // Switch to dark mode
        document.body.classList.add('night-mode');
        localStorage.setItem('nightMode', 'true');
        updateNightModeButton(true);
    }
    
    // Fix music button styling after mode change
    setTimeout(fixMusicButtonStyles, 100);
    
    // Dispatch custom event for other components to listen to
    document.dispatchEvent(new CustomEvent('nightModeChanged'));
}

// Update button appearance
function updateNightModeButton(isDarkMode) {
    const button = document.getElementById('nightModeToggle');
    if (!button) return;
    
    if (isDarkMode) {
        button.innerHTML = '☀️';  // Sun emoji with text for switching to light mode
        button.title = 'Switch to Light Mode';
    } else {
        button.innerHTML = '🌙';  // Moon emoji with text for switching to dark mode
        button.title = 'Switch to Night Mode';
    }
}

// Fix music button styling
function fixMusicButtonStyles() {
    const musicBtn = document.querySelector('.nav-music-btn');
    if (musicBtn) {
        // Ensure inline styles don't override our CSS
        musicBtn.style.color = '';
        
        // Force style update by removing and adding a class
        musicBtn.classList.remove('nav-fix');
        void musicBtn.offsetWidth; // Trigger reflow
        musicBtn.classList.add('nav-fix');
    }
}