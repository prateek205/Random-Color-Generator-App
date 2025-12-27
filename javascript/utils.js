// UI Utility Functions

/**
 * Show notification message
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Set message
    notificationText.textContent = message;
    
    // Set color based on type
    const colors = {
        'success': '#2ecc71',
        'error': '#e74c3c',
        'info': '#3498db',
        'warning': '#f39c12'
    };
    
    notification.style.background = colors[type] || colors.success;
    
    // Show notification
    notification.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Copied to clipboard!', 'success');
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            showNotification('Failed to copy!', 'error');
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
}

/**
 * Format HEX color code
 */
function formatHex(hex) {
    return hex.toUpperCase();
}

/**
 * Format RGB color code
 */
function formatRgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Format HSL color code
 */
function formatHsl(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Update color display
 */
function updateColorDisplay(hex) {
    const colorDisplay = document.getElementById('colorDisplay');
    const hexCode = document.getElementById('hexCode');
    const rgbCode = document.getElementById('rgbCode');
    const hslCode = document.getElementById('hslCode');
    
    // Update display color
    colorDisplay.style.background = hex;
    
    // Get color information
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Update code displays
    hexCode.textContent = formatHex(hex);
    rgbCode.textContent = formatRgb(rgb.r, rgb.g, rgb.b);
    hslCode.textContent = formatHsl(hsl.h, hsl.s, hsl.l);
}

/**
 * Update color details
 */
function updateColorDetails(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const type = getColorType(rgb.r, rgb.g, rgb.b);
    const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
    
    // Update detail values
    document.getElementById('luminanceValue').textContent = 
        `${Math.round(luminance * 100)}%`;
    document.getElementById('saturationValue').textContent = 
        `${hsl.s}%`;
    document.getElementById('hueValue').textContent = 
        `${hsl.h}°`;
    
    // Update color type
    const typeBadge = document.getElementById('colorType');
    typeBadge.textContent = type;
    typeBadge.style.background = type === 'Light' ? '#f8f9fa' : '#343a40';
    typeBadge.style.color = type === 'Light' ? '#212529' : '#fff';
    
    // Update contrast ratios
    const blackContrast = calculateContrastRatio(rgb, { r: 0, g: 0, b: 0 });
    const whiteContrast = calculateContrastRatio(rgb, { r: 255, g: 255, b: 255 });
    
    document.getElementById('blackContrast').textContent = 
        blackContrast.toFixed(1);
    document.getElementById('whiteContrast').textContent = 
        whiteContrast.toFixed(1);
    
    // Update contrast sample backgrounds
    document.getElementById('blackText').style.background = hex;
    document.getElementById('whiteText').style.background = hex;
}

/**
 * Create a color element for grid display
 */
function createColorElement(color, type = 'preset') {
    const element = document.createElement('div');
    element.className = type === 'preset' ? 'preset-color' : 'recent-color';
    element.style.background = color;
    element.setAttribute('title', color);
    
    // Add click event
    element.addEventListener('click', () => {
        updateColorDisplay(color);
        updateColorDetails(color);
        showNotification(`Selected ${color}`, 'info');
    });
    
    return element;
}

/**
 * Update recent colors display
 */
function updateRecentColorsDisplay(colors) {
    const recentGrid = document.getElementById('recentGrid');
    recentGrid.innerHTML = '';
    
    colors.slice(0, 12).forEach(color => {
        recentGrid.appendChild(createColorElement(color, 'recent'));
    });
}

/**
 * Update preset colors display
 */
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

/**
 * Add color to history
 */
function addToHistory(hex) {
    const historyGrid = document.getElementById('historyGrid');
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    historyItem.innerHTML = `
        <div class="history-color" style="background: ${hex};"></div>
        <div class="history-info">
            <div><strong>${formatHex(hex)}</strong></div>
            <div>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
            <div>HSL: ${hsl.h}°, ${hsl.s}%, ${hsl.l}%</div>
        </div>
    `;
    
    historyItem.addEventListener('click', () => {
        updateColorDisplay(hex);
        updateColorDetails(hex);
        showNotification(`Loaded from history: ${hex}`, 'info');
    });
    
    // Add to beginning and limit to 10 items
    historyGrid.insertBefore(historyItem, historyGrid.firstChild);
    if (historyGrid.children.length > 10) {
        historyGrid.removeChild(historyGrid.lastChild);
    }
}

/**
 * Toggle modal visibility
 */
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
        modal.classList.add('active');
    } else {
        modal.classList.remove('active');
    }
}

/**
 * Export color palette
 */
function exportPalette(colors, format = 'json') {
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
        const dataStr = JSON.stringify(colors, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `color-palette-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Palette exported as JSON!', 'success');
    } else if (format === 'css') {
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
}