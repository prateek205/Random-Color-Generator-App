// ============================================
// COLOR UTILITY FUNCTIONS
// ============================================

function generateRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function calculateLuminance(r, g, b) {
    const sRGB = [r, g, b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function calculateContrastRatio(color1, color2) {
    const lum1 = calculateLuminance(color1.r, color1.g, color1.b);
    const lum2 = calculateLuminance(color2.r, color2.g, color2.b);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function getColorType(r, g, b) {
    const luminance = calculateLuminance(r, g, b);
    return luminance > 0.5 ? 'Light' : 'Dark';
}

// ============================================
// UI UTILITY FUNCTIONS
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    
    const colors = {
        'success': '#2ecc71',
        'error': '#e74c3c',
        'info': '#3498db'
    };
    
    notification.style.background = colors[type] || colors.success;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy!', 'error');
        });
}

function updateColorDisplay(hex) {
    const colorDisplay = document.getElementById('colorDisplay');
    const hexCode = document.getElementById('hexCode');
    const rgbCode = document.getElementById('rgbCode');
    const hslCode = document.getElementById('hslCode');
    
    colorDisplay.style.background = hex;
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    hexCode.textContent = hex.toUpperCase();
    rgbCode.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    hslCode.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function updateColorDetails(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const type = getColorType(rgb.r, rgb.g, rgb.b);
    const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
    
    document.getElementById('luminanceValue').textContent = `${Math.round(luminance * 100)}%`;
    document.getElementById('saturationValue').textContent = `${hsl.s}%`;
    document.getElementById('hueValue').textContent = `${hsl.h}°`;
    
    const typeBadge = document.getElementById('colorType');
    typeBadge.textContent = type;
    typeBadge.style.background = type === 'Light' ? '#f8f9fa' : '#343a40';
    typeBadge.style.color = type === 'Light' ? '#212529' : '#fff';
    
    const blackContrast = calculateContrastRatio(rgb, { r: 0, g: 0, b: 0 });
    const whiteContrast = calculateContrastRatio(rgb, { r: 255, g: 255, b: 255 });
    
    document.getElementById('blackContrast').textContent = blackContrast.toFixed(1);
    document.getElementById('whiteContrast').textContent = whiteContrast.toFixed(1);
    
    document.getElementById('blackText').style.background = hex;
    document.getElementById('whiteText').style.background = hex;
}

function createColorElement(color, type = 'preset') {
    const element = document.createElement('div');
    element.className = type === 'preset' ? 'preset-color' : 'recent-color';
    element.style.background = color;
    element.setAttribute('title', color);
    
    element.addEventListener('click', () => {
        updateCurrentColor(color);
        showNotification(`Selected ${color}`, 'info');
    });
    
    return element;
}

function updatePresetColorsDisplay() {
    const presetGrid = document.getElementById('presetGrid');
    presetGrid.innerHTML = '';
    
    const presetColors = [
        '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9A76',
        '#6A0572', '#AB83A1', '#3D5A80', '#EE6C4D', '#98C1D9',
        '#293241', '#E0FBFC', '#5C4D7D', '#F9564F', '#0C0A3E'
    ];
    
    presetColors.forEach(color => {
        presetGrid.appendChild(createColorElement(color));
    });
}

function addToHistory(hex) {
    const historyGrid = document.getElementById('historyGrid');
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    historyItem.innerHTML = `
        <div class="history-color" style="background: ${hex};"></div>
        <div class="history-info">
            <div><strong>${hex.toUpperCase()}</strong></div>
            <div>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
            <div>HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%</div>
        </div>
    `;
    
    historyItem.addEventListener('click', () => {
        updateCurrentColor(hex);
        showNotification(`Loaded from history: ${hex}`, 'info');
    });
    
    historyGrid.insertBefore(historyItem, historyGrid.firstChild);
    if (historyGrid.children.length > 12) {
        historyGrid.removeChild(historyGrid.lastChild);
    }
}

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    currentColor: '#3498db',
    recentColors: [],
    autoMode: false,
    autoInterval: 3000,
    intervalId: null,
    generatedCount: 0
};

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
    
    document.getElementById('generatedCount').textContent = state.generatedCount;
    updateRecentColorsDisplay();
}

function saveState() {
    try {
        localStorage.setItem('colorGeneratorState', JSON.stringify(state));
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

function updateCurrentColor(hex) {
    state.currentColor = hex;
    state.generatedCount++;
    
    if (!state.recentColors.includes(hex)) {
        state.recentColors.unshift(hex);
        if (state.recentColors.length > 12) {
            state.recentColors.pop();
        }
    }
    
    document.getElementById('generatedCount').textContent = state.generatedCount;
    updateColorDisplay(hex);
    updateColorDetails(hex);
    updateRecentColorsDisplay();
    addToHistory(hex);
    
    saveState();
}

function updateRecentColorsDisplay() {
    const recentGrid = document.getElementById('recentGrid');
    recentGrid.innerHTML = '';
    
    state.recentColors.slice(0, 12).forEach(color => {
        recentGrid.appendChild(createColorElement(color, 'recent'));
    });
}

function toggleAutoMode() {
    state.autoMode = !state.autoMode;
    
    const button = document.getElementById('toggleAutoBtn');
    const icon = button.querySelector('i');
    
    if (state.autoMode) {
        icon.className = 'fas fa-pause';
        button.innerHTML = '<i class="fas fa-pause"></i> Auto Mode: ON';
        
        state.intervalId = setInterval(() => {
            const newColor = generateRandomHex();
            updateCurrentColor(newColor);
        }, state.autoInterval);
    } else {
        if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = null;
        }
        
        icon.className = 'fas fa-play';
        button.innerHTML = '<i class="fas fa-play"></i> Auto Mode';
    }
}

function updateAutoInterval(seconds) {
    state.autoInterval = seconds * 1000;
    
    if (state.autoMode && state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = setInterval(() => {
            const newColor = generateRandomHex();
            updateCurrentColor(newColor);
        }, state.autoInterval);
    }
}

function clearRecentColors() {
    state.recentColors = [];
    updateRecentColorsDisplay();
    saveState();
    showNotification('Recent colors cleared', 'info');
}

function exportPalette() {
    const colors = [state.currentColor, ...state.recentColors];
    const timestamp = new Date().toISOString().split('T')[0];
    
    let cssContent = `/* Color Palette - Generated ${timestamp} */\n\n`;
    colors.forEach((color, index) => {
        cssContent += `--color-${index + 1}: ${color};\n`;
    });
    
    const dataBlob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-palette-${timestamp}.css`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Palette exported as CSS!', 'success');
}

// ============================================
// INITIALIZATION AND EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', () => {
        const newColor = generateRandomHex();
        updateCurrentColor(newColor);
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
    
    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', clearRecentColors);
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportPalette);
    
    // Share button
    document.getElementById('shareBtn').addEventListener('click', () => {
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            document.getElementById('generateBtn').click();
        }
        if (e.code === 'KeyA') {
            toggleAutoMode();
        }
    });
}

function initializeApp() {
    initializeState();
    updatePresetColorsDisplay();
    updateCurrentColor(state.currentColor);
    setupEventListeners();
    
    console.log('%c🎨 Color Generator Initialized!', 'color: #3498db; font-size: 18px; font-weight: bold;');
    console.log('🚀 Press Spacebar to generate new colors, A to toggle auto mode');
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (state.intervalId) {
        clearInterval(state.intervalId);
    }
    saveState();
});