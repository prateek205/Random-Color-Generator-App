// State Management Functions

// Global state
const state = {
    currentColor: '#FFFFFF',
    recentColors: [],
    favorites: [],
    autoMode: false,
    autoInterval: 3000,
    intervalId: null,
    generatedCount: 0,
    displayFormat: 'hex'
};

/**
 * Initialize state from localStorage
 */
function initializeState() {
    try {
        const savedState = localStorage.getItem('colorGeneratorState');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            Object.assign(state, parsed);
        }
    } catch (error) {
        console.error('Error loading state:', error);
    }
    
    // Update generated count display
    document.getElementById('generatedCount').textContent = state.generatedCount;
    
    // Restore recent colors display
    updateRecentColorsDisplay(state.recentColors);
}

/**
 * Save state to localStorage
 */
function saveState() {
    try {
        localStorage.setItem('colorGeneratorState', JSON.stringify(state));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

/**
 * Update current color
 */
function updateCurrentColor(hex) {
    state.currentColor = hex;
    state.generatedCount++;
    
    // Add to recent colors if not already present
    if (!state.recentColors.includes(hex)) {
        state.recentColors.unshift(hex);
        if (state.recentColors.length > 20) {
            state.recentColors.pop();
        }
    }
    
    // Update UI
    document.getElementById('generatedCount').textContent = state.generatedCount;
    updateRecentColorsDisplay(state.recentColors);
    
    // Save state
    saveState();
}

/**
 * Toggle auto mode
 */
function toggleAutoMode() {
    state.autoMode = !state.autoMode;
    
    const button = document.getElementById('toggleAutoBtn');
    const icon = button.querySelector('i');
    
    if (state.autoMode) {
        // Start auto mode
        icon.className = 'fas fa-pause';
        button.innerHTML = '<i class="fas fa-pause"></i> Auto Mode: ON';
        
        state.intervalId = setInterval(() => {
            const newColor = generateRandomHex();
            updateCurrentColor(newColor);
            updateColorDisplay(newColor);
            updateColorDetails(newColor);
            addToHistory(newColor);
        }, state.autoInterval);
    } else {
        // Stop auto mode
        if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
        
        icon.className = 'fas fa-play';
        button.innerHTML = '<i class="fas fa-play"></i> Auto Mode';
    }
}

/**
 * Update auto interval
 */
function updateAutoInterval(seconds) {
    state.autoInterval = seconds * 1000;
    
    // Restart auto mode with new interval if it's running
    if (state.autoMode && state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = setInterval(() => {
            const newColor = generateRandomHex();
            updateCurrentColor(newColor);
            updateColorDisplay(newColor);
            updateColorDetails(newColor);
            addToHistory(newColor);
        }, state.autoInterval);
    }
}

/**
 * Toggle favorite color
 */
function toggleFavorite(color) {
    const index = state.favorites.indexOf(color);
    
    if (index === -1) {
        // Add to favorites
        state.favorites.push(color);
        showNotification('Added to favorites!', 'success');
    } else {
        // Remove from favorites
        state.favorites.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    }
    
    saveState();
}

/**
 * Clear recent colors
 */
function clearRecentColors() {
    state.recentColors = [];
    updateRecentColorsDisplay(state.recentColors);
    saveState();
    showNotification('Recent colors cleared', 'info');
}

/**
 * Clear all history
 */
function clearHistory() {
    state.recentColors = [];
    state.favorites = [];
    document.getElementById('historyGrid').innerHTML = '';
    saveState();
    showNotification('All history cleared', 'info');
}

/**
 * Change display format
 */
function changeDisplayFormat(format) {
    state.displayFormat = format;
    
    // Update active button
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.format === format);
    });
    
    // Update current color display based on format
    const rgb = hexToRgb(state.currentColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    let displayValue = '';
    switch (format) {
        case 'hex':
            displayValue = formatHex(state.currentColor);
            break;
        case 'rgb':
            displayValue = formatRgb(rgb.r, rgb.g, rgb.b);
            break;
        case 'hsl':
            displayValue = formatHsl(hsl.h, hsl.s, hsl.l);
            break;
    }
    
    // Highlight the main display
    document.getElementById('hexCode').style.fontWeight = 
        format === 'hex' ? 'bold' : 'normal';
    document.getElementById('rgbCode').style.fontWeight = 
        format === 'rgb' ? 'bold' : 'normal';
    document.getElementById('hslCode').style.fontWeight = 
        format === 'hsl' ? 'bold' : 'normal';
}