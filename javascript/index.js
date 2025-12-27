// Main Application - Initialization and Event Listeners

/**
 * Initialize the application
 */
function initializeApp() {
    // Load state from localStorage
    initializeState();
    
    // Setup preset colors
    updatePresetColorsDisplay();
    
    // Set initial color
    updateColorDisplay(state.currentColor);
    updateColorDetails(state.currentColor);
    
    // Setup event listeners
    setupEventListeners();
    
    // Log initialization
    console.log('%c🎨 Color Generator Initialized!', 'color: #3498db; font-size: 18px; font-weight: bold;');
    console.log('🚀 Features:', 'color: #2ecc71;');
    console.log('• Generate random colors', 'color: #666;');
    console.log('• Copy HEX/RGB/HSL values', 'color: #666;');
    console.log('• Auto generation mode', 'color: #666;');
    console.log('• Color history and favorites', 'color: #666;');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', () => {
        const newColor = generateRandomHex();
        updateCurrentColor(newColor);
        updateColorDisplay(newColor);
        updateColorDetails(newColor);
        addToHistory(newColor);
        showNotification('New color generated!', 'success');
    });
    
    // Auto mode toggle
    document.getElementById('toggleAutoBtn').addEventListener('click', toggleAutoMode);
    
    // Interval slider
    document.getElementById('intervalSlider').addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('intervalValue').textContent = value;
        updateAutoInterval(value);
    });
    
    // Copy buttons
    document.getElementById('copyHex').addEventListener('click', () => {
        copyToClipboard(document.getElementById('hexCode').textContent);
    });
    
    document.getElementById('copyRgb').addEventListener('click', () => {
        copyToClipboard(document.getElementById('rgbCode').textContent);
    });
    
    document.getElementById('copyHsl').addEventListener('click', () => {
        copyToClipboard(document.getElementById('hslCode').textContent);
    });
    
    // Format options
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            changeDisplayFormat(e.target.dataset.format);
        });
    });
    
    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', clearRecentColors);
    
    // Footer buttons
    document.getElementById('exportBtn').addEventListener('click', (e) => {
        e.preventDefault();
        exportPalette(state.recentColors, 'json');
    });
    
    document.getElementById('shareBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (navigator.share) {
            navigator.share({
                title: 'Check out this color!',
                text: `Current color: ${state.currentColor}`,
                url: window.location.href
            });
        } else {
            copyToClipboard(state.currentColor);
        }
    });
    
    document.getElementById('aboutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal('aboutModal', true);
    });
    
    // Modal close button
    document.getElementById('closeModal').addEventListener('click', () => {
        toggleModal('aboutModal', false);
    });
    
    // Close modal when clicking outside
    document.getElementById('aboutModal').addEventListener('click', (e) => {
        if (e.target.id === 'aboutModal') {
            toggleModal('aboutModal', false);
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Spacebar - Generate new color
        if (e.code === 'Space') {
            e.preventDefault();
            document.getElementById('generateBtn').click();
        }
        // A key - Toggle auto mode
        if (e.code === 'KeyA') {
            toggleAutoMode();
        }
        // Escape - Close modal
        if (e.code === 'Escape') {
            toggleModal('aboutModal', false);
        }
        // 1, 2, 3 - Change format
        if (e.code === 'Digit1') changeDisplayFormat('hex');
        if (e.code === 'Digit2') changeDisplayFormat('rgb');
        if (e.code === 'Digit3') changeDisplayFormat('hsl');
    });
    
    // Page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && state.autoMode) {
            // Stop auto mode when page is hidden
            clearInterval(state.intervalId);
            state.intervalId = null;
        } else if (!document.hidden && state.autoMode && !state.intervalId) {
            // Restart auto mode when page is visible
            toggleAutoMode();
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (state.intervalId) {
        clearInterval(state.intervalId);
    }
    saveState();
});